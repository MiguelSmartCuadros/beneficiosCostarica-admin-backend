import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/logger";
import { ErrorI } from "../interfaces/error.interface";

/**
 * Middleware para sanitizar contenido HTML y prevenir inyecciones SQL y XSS
 * Elimina palabras clave peligrosas mientras preserva el formato HTML seguro
 */
export const sanitizeHtmlContent = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lista de palabras clave peligrosas (SQL injection y scripting)
        const dangerousKeywords = [
            // SQL Keywords
            'select', 'insert', 'update', 'delete', 'drop', 'create', 'alter',
            'truncate', 'exec', 'execute', 'union', 'join', 'where', 'from',
            'table', 'database', 'schema', 'grant', 'revoke', 'commit', 'rollback',

            // SQL Functions y comandos
            'sleep', 'benchmark', 'waitfor', 'delay', 'load_file', 'into outfile',
            'into dumpfile', 'information_schema', 'mysql', 'pg_', 'sys.',

            // Palabras sensibles
            'password', 'passwd', 'pwd', 'user', 'admin', 'root', 'username',
            'credential', 'token', 'secret', 'key', 'auth',

            // Script y código
            'script', 'javascript:', 'onerror', 'onload', 'onclick', 'onmouseover',
            'onfocus', 'onblur', 'eval', 'expression', 'vbscript:', 'data:',

            // Extensiones de archivos peligrosos
            '.js', '.py', '.php', '.exe', '.bat', '.sh', '.cmd', '.vbs',
            '.jar', '.sql', '.rb', '.pl', '.asp', '.aspx', '.jsp',

            // Comentarios SQL
            '--', '/*', '*/', '#',

            // Caracteres especiales SQL
            ';--', '||', '&&', 'xp_', 'sp_',
        ];

        // Patrones regex adicionales para detectar ataques
        const dangerousPatterns = [
            /<script\b[^>]*>([\s\S]*?)<\/script>/gim, // Tags script con contenido
            /<script\b[^>]*\/>/gim,                   // Tags script self-closing
            /<script\b[^>]*>/gim,                     // Tags script abiertos (sin cerrar)
            /javascript:/gim,                         // Protocolo javascript
            /on\w+\s*=/gim,                           // Event handlers (onclick, onerror, etc)
            /eval\s*\(/gim,                           // Función eval
            /expression\s*\(/gim,                     // CSS expressions
            /<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, // iframes
            /<object\b[^>]*>([\s\S]*?)<\/object>/gim, // objects
            /<embed\b[^>]*>([\s\S]*?)<\/embed>/gim,   // embeds
            /data:text\/html/gim,                     // Data URIs HTML
            /vbscript:/gim,                           // VBScript
        ];

        // Función para sanitizar un string
        const sanitizeString = (text: string): string => {
            if (!text || typeof text !== 'string') return text;

            let sanitized = text;

            // Eliminar patrones peligrosos usando regex
            dangerousPatterns.forEach(pattern => {
                sanitized = sanitized.replace(pattern, '');
            });

            // Función para escapar caracteres especiales en regex
            const escapeRegExp = (string: string) => {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            };

            // Eliminar palabras clave peligrosas (case insensitive)
            dangerousKeywords.forEach(keyword => {
                const escapedKeyword = escapeRegExp(keyword);
                // Solo usar \b si el keyword empieza/termina con caracteres de palabra
                const prefix = /^\w/.test(keyword) ? '\\b' : '';
                const suffix = /\w$/.test(keyword) ? '\\b' : '';

                const regex = new RegExp(`${prefix}${escapedKeyword}${suffix}`, 'gi');
                sanitized = sanitized.replace(regex, '');
            });

            // Limpiar múltiples espacios y saltos de línea excesivos
            sanitized = sanitized.replace(/\s{2,}/g, ' ').trim();

            return sanitized;
        };

        // Sanitizar campos específicos del body
        const fieldsToSanitize = [
            'discount_description',
            'description',
            'terms_conditions',
            'restrictions'
        ];

        // Aplicar sanitización a cada campo HTML
        fieldsToSanitize.forEach(field => {
            if (req.body[field]) {
                const original = req.body[field];
                req.body[field] = sanitizeString(original);

                // Log si se detectó contenido peligroso
                if (original !== req.body[field]) {
                    logger.warn(`Contenido potencialmente peligroso detectado y sanitizado en campo: ${field}`);
                }
            }
        });

        // Validación específica para url_terms_conditions
        if (req.body.url_terms_conditions) {
            const url = req.body.url_terms_conditions;

            // Verificar que sea un string
            if (typeof url !== 'string') {
                return res.status(400).json({
                    error: true,
                    message: "La URL de términos y condiciones debe ser un texto",
                    statusCode: 400
                });
            }

            // Verificar extensión .pdf y formato básico de URL
            // Permitimos http://, https:// o rutas relativas que terminen en .pdf
            const pdfRegex = /\.pdf$/i;
            // Regex simple para evitar javascript: u otros protocolos peligrosos
            const dangerousProtocolRegex = /^(javascript|vbscript|data):/i;

            if (!pdfRegex.test(url)) {
                return res.status(400).json({
                    error: true,
                    message: "La URL de términos y condiciones debe ser un archivo PDF (.pdf)",
                    statusCode: 400
                });
            }

            if (dangerousProtocolRegex.test(url)) {
                return res.status(400).json({
                    error: true,
                    message: "Protocolo de URL no permitido",
                    statusCode: 400
                });
            }
        }

        next();
    } catch (error: any) {
        logger.error(`Error en sanitización de HTML: ${error.message}`);
        const responseError: ErrorI = {
            error: true,
            message: "Error al procesar el contenido HTML",
            statusCode: 500,
        };
        return res.status(500).json(responseError);
    }
};
