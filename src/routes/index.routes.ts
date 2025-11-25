import Router, { Request, Response } from "express";

import { authRouter } from "../routes/auth.routes";
import { verify_JWT } from "../middlewares/verifyToken";
import { projectInfo } from "../routes/projectInfo.routes";
import { isAdmin } from "../middlewares/isAdmin";
import { documentation } from "../routes/documentation.routes";
import { categoriesRouter } from "../routes/categories.routes";
import { typeshopsRouter } from "../routes/typeshops.routes";
import { provincesRouter } from "../routes/provinces.routes";
import { userRolesRouter } from "../routes/user_roles.routes";
import { tipoDocumentoIdentidadRouter } from "../routes/tipo_documento_identidad.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/projectInfo", projectInfo);
router.use("/doc", documentation);
router.use("/categories", categoriesRouter);
router.use("/typeshops", typeshopsRouter);
router.use("/provinces", provincesRouter);
router.use("/user-roles", userRolesRouter);
router.use("/tipo-documento-identidad", tipoDocumentoIdentidadRouter);

router.use("/admin", verify_JWT, isAdmin, (_req: Request, res: Response) => {
  res.status(202).json({
    message: "Acceso concedido. El usuario tiene privilegios de administrador",
  });
});

export { router };