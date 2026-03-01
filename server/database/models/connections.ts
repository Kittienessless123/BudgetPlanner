import { Sequelize } from "sequelize";
import type { User } from "./user.model.ts";
import type { Token } from "./token.model.ts";

export const setupConnections = (sequelize: Sequelize): void => {
  const { models } = sequelize;

  // Пример связей
  if (models.User && models.Token) {
    (models.User as unknown as typeof User).hasMany(
      models.Token as unknown as typeof Token,
      {
        foreignKey: "user_id",
        as: "tokens",
      },
    );

    (models.Token as unknown as typeof Token).belongsTo(
      models.User as unknown as typeof User,
      {
        foreignKey: "user_id",
        as: "user",
      },
    );
  }

  // и так далее...
};
