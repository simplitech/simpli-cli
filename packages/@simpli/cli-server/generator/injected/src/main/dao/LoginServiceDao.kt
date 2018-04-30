<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.dao

import <%-packageAddress%>.model.<%-userTable.modelName%>
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao
import java.sql.Connection

/**
 * Responsible for database login operations
 * @author Simpli© CLI generator
 */
class LoginServiceDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {

    fun getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-accountColumn.kotlinType%>?): Long {
        return nullToZero(selectFirstLong("""
                SELECT <%-userTable.idColumn.name%>
                FROM <%-userTable.name%>
                WHERE <%-accountColumn.name%> = ?
                AND <%-passwordColumn.name%> = sha2(?, 256)
                """,
                <%-accountColumn.name%>, <%-passwordColumn.name%>))
    }

    fun get<%-userTable.modelName%>(<%-userTable.idColumn.name%>: <%-userTable.idColumn.kotlinType%>): <%-userTable.modelName%>? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM <%-userTable.name%>
            WHERE <%-userTable.idColumn.name%> = ?
            """, { rs -> <%-userTable.modelName%>.buildAll(rs) }, <%-userTable.idColumn.name%>)
    }
}
