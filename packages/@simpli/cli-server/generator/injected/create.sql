<%_ if (options.serverSetup.createSQL) { _%>
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `<%-options.serverSetup.connection.database%>`;

CREATE SCHEMA IF NOT EXISTS `<%-options.serverSetup.connection.database%>` DEFAULT CHARACTER SET utf8mb4 ;
USE `<%-options.serverSetup.connection.database%>`;

<%-options.serverSetup.createSQL.dump.schema%>

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
<%_ } _%>
