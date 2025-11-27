import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { UserRoles } from "../../models/UserRoles";
import { Stores } from "../../models/Stores";
import { StoresAttributes, StoresCreationAttributes } from "../../interfaces/stores.interface";
import { UserProfileAttributes, UserProfileCreationAttributes } from "../../interfaces/user_profile.interface";
import { UserProfile } from "../../models/UserProfile";

export const loginService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username ? req.body.username.toString() : "";
    const password: string = req.body.password ? req.body.password.toString() : "";

    if (!username || !password) {
      logger.error("Username y password son requeridos | status: 403");
      return res.status(403).json({ login: false, error: "Username y password son requeridos" });
    }

    const user: Model<UsersAttributes, UsersCreationAttributes> | null = await Users.findOne({
      where: {
        username,
      },
    });

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

    const user_profile: Model<UserProfileAttributes, UserProfileCreationAttributes> | null = await UserProfile.findOne({
      where: {
        id: user.getDataValue("id_user"),
      },
    });

    const responseBody: any = {
      login: true,
      user_role: user_role.getDataValue("role"),
    };

    if (user_role.getDataValue("role") === "ROLE_CORP") {
      let store: Model<StoresAttributes, StoresCreationAttributes> | null = null;

      if (user_profile) {
        store = await Stores.findOne({
          where: {
            id_user_responsible: user_profile.getDataValue("id"),
          },
        });
      }

      logger.info(`Store found: ${store ? JSON.stringify(store.toJSON()) : "null"}`);

      if (store) {
        responseBody.id_store = store.getDataValue("id_stores");
      } else {
        responseBody.id_store = null;
      }
    } else {
      logger.info(`User role is not ROLE_CORP, skipping store lookup.`);
    }

    return res
      .header({
        "Access-Control-Expose-Headers": "x-access-token",
        "x-access-token": token,
      })
      .status(200)
      .json(responseBody);
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
