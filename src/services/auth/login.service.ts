import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { UserRoles } from "../../models/UserRoles";

export const loginService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
  try {
    const usernameOrEmail: string = req.body.username ? req.body.username.toString() : "";
    const password: string = req.body.password ? req.body.password.toString() : "";

    if (!usernameOrEmail || !password) {
      logger.error("Username/Email y password son requeridos | status: 403");
      return res.status(403).json({ login: false, error: "Username/Email y password son requeridos" });
    }

    let user: Model<UsersAttributes, UsersCreationAttributes> | null = null;

    // Check if input is email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

    if (isEmail) {
      // Find user by email via UserProfile
      const userProfile = await UserProfile.findOne({
        where: { email: usernameOrEmail },
        include: [{
          model: Users,
          required: true
        }]
      });

      if (userProfile) {
        user = userProfile.getDataValue('user') as Model<UsersAttributes, UsersCreationAttributes>;
      }
    } else {
      // Find user by username
      user = await Users.findOne({
        where: {
          username: usernameOrEmail,
        },
      });
    }

    if (!user) {
      logger.error("Usuario no encontrado | status: 404");
      const responseError: ErrorI = {
        error: true,
        message: "Usuario o contraseña inválida",
        statusCode: 404,
      };
      return res.status(404).json(responseError);
    }

    if (!user.getDataValue("enabled")) {
      logger.error("Usuario o contraseña inválida. Contacta al personal de SmartFit");
      const responseError: ErrorI = {
        error: true,
        message: "Usuario o contraseña inválida. Contacta al personal de SmartFit",
        statusCode: 401,
      };
      return res.status(401).json(responseError);
    }

    const validPassword: boolean = await bcrypt.compare(password, user.getDataValue("password"));

    if (!validPassword) {
      logger.error("Contraseña inválida | status: 401");
      const responseError: ErrorI = {
        error: true,
        message: "Usuario o contraseña inválida",
        statusCode: 401,
      };
      return res.status(401).json(responseError);
    }

    const user_role: Model<UserRolesAttributes, UserRolesCreationAttributes> | null = await UserRoles.findByPk(user.getDataValue("id_user_role"));

    if (!user_role) {
      logger.error("Rol de usuario no encontrado | status: 404");
      const responseError: ErrorI = {
        error: true,
        message: "Rol de usuario no encontrado",
        statusCode: 404,
      };
      return res.status(404).json(responseError);
    }

    if (!process.env.WORD_SECRET) {
      throw new Error("La variable de entorno WORD_SECRET no esta definida");
    }

    const sign_token_options: jwt.SignOptions = {
      expiresIn: process.env.TIME_TOKEN,
    };

    const token = jwt.sign(
      {
        id_user: user.getDataValue("id_user"),
        username: user.getDataValue("username"),
        id_user_role: user.getDataValue("id_user_role"),
      },
      process.env.WORD_SECRET,
      sign_token_options
    );

    return res
      .header({
        "Access-Control-Expose-Headers": "x-access-token",
        "x-access-token": token,
      })
      .status(200)
      .json({ login: true, user_role: user.getDataValue("id_user_role") }); // Returning id_user_role as requested
  } catch (error: any) {
    const responseError: ErrorI = {
      error: true,
      message: error.message || `Error al logear usuario: ${error}`,
      statusCode: 500,
    };
    logger.error(`Error al logear usuario: ${responseError.message} | status: 500`);
    throw responseError;
  }
};
