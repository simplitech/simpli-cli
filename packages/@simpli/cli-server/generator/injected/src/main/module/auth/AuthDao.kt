<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import br.com.simpli.sql.AbstractConnector
import br.com.simpli.sql.Query

/**
 * Authentication business logic
 * @author Simpli CLI generator
 */
class AuthDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {

    fun getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>): Long? {
        val query = Query()
                .select("<%-userTable.idColumn.name%>")
                .from("<%-userTable.name%>")
                .whereEq("<%-accountColumn.field%>", <%-accountColumn.name%>)
                .where("<%-passwordColumn.field%> = SHA2(?, 256)", <%-passwordColumn.name%>)

        return con.getFirstLong(query)
    }

    fun get<%-userTable.modelName%>(<%-userTable.idColumn.name%>: <%-userTable.idColumn.kotlinType%>): <%-userTable.modelName%>? {
        val query = Query()
                .selectAll()
                .from("<%-userTable.name%>")
                .whereEq("<%-userTable.idColumn.field%>", <%-userTable.idColumn.name%>)

        return con.getOne(query) {
            <%-userTable.modelName%>(it)
        }
    }

    fun get<%-userTable.modelName%>ByEmail(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>): <%-userTable.modelName%>? {
        val query = Query()
                .selectAll()
                .from("<%-userTable.name%>")
                .whereEq("<%-accountColumn.field%>", <%-accountColumn.name%>)

        return con.getOne(query) {
            <%-userTable.modelName%>(it)
        }
    }

    fun update<%-userTable.modelName%>Password(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>): Int {
        val query = Query()
                .updateTable("<%-userTable.name%>")
                .updateSet(
                        "<%-passwordColumn.field%>" to Query("SHA2(?, 256)", <%-passwordColumn.name%>)
                )
                .whereEq("<%-accountColumn.field%>", <%-accountColumn.name%>)

        return con.execute(query).affectedRows
    }

}
