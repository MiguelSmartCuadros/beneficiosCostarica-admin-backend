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
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,  // Tags script completos
            /javascript:/gi,                          // Protocolo javascript
            /on\w+\s*=/gi,                           // Event handlers (onclick, onerror, etc)
            /eval\s*\(/gi,                           // Función eval
            /expression\s*\(/gi,                     // CSS expressions
            /<iframe[\s\S]*?>/gi,                    // iframes
            /<object[\s\S]*?>/gi,                    // objects
            /<embed[\s\S]*?>/gi,                     // embeds
            /data:text\/html/gi,                     // Data URIs HTML
            /vbscript:/gi,                           // VBScript
        ];

        // Función para sanitizar un string
        const sanitizeString = (text: string): string => {
            if (!text || typeof text !== 'string') return text;

            let sanitized = text;

            // Eliminar patrones peligrosos usando regex
            dangerousPatterns.forEach(pattern => {
                sanitized = sanitized.replace(pattern, '');
            });

            // Eliminar palabras clave peligrosas (case insensitive)
            dangerousKeywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
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
            'restrictions',
            'url_terms_conditions'
        ];

        // Aplicar sanitización a cada campo
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
