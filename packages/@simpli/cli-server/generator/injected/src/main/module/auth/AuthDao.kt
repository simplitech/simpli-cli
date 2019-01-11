<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.model.<%-userTable.modelName%>
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.Dao
import java.sql.Connection

/**
 * Responsible for database authentication operations
 * @author Simpli CLI generator
 */
class AuthDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {

    fun getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): Long? {
        return selectFirstLong("""
                SELECT <%-userTable.idColumn.name%>
                FROM <%-userTable.name%>
                WHERE <%-accountColumn.field%> = ?
                AND <%-passwordColumn.field%> = sha2(?, 256)
                """,
                <%-accountColumn.name%>, <%-passwordColumn.name%>)
    }

    fun get<%-userTable.modelName%>(<%-userTable.idColumn.name%>: <%-userTable.idColumn.kotlinType%>): <%-userTable.modelName%>? {
        return selectOne("""
            SELECT *
            FROM <%-userTable.name%>
            WHERE <%-userTable.idColumn.field%> = ?
            """, { rs -> <%-userTable.modelName%>(rs) }, <%-userTable.idColumn.name%>)
    }

    fun get<%-userTable.modelName%>ByEmail(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?): <%-userTable.modelName%>? {
        return selectOne("""
            SELECT *
            FROM <%-userTable.name%>
            WHERE <%-accountColumn.field%> = ?
            """, { rs -> <%-userTable.modelName%>(rs)}, <%-accountColumn.name%>)
    }

    fun update<%-userTable.modelName%>Password(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>): Int {
        return update("""
            UPDATE <%-userTable.name%>
            SET <%-passwordColumn.field%> = IF(? IS NOT NULL, SHA2(?, 256), <%-passwordColumn.field%>)
            WHERE <%-accountColumn.field%> = ?
            """, <%-passwordColumn.name%>, <%-passwordColumn.name%>, <%-accountColumn.name%>).affectedRows
    }

}
