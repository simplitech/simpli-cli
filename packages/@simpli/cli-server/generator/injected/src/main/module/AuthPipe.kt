<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>

import <%-packageAddress%>.<%-moduleName%>.process.LoginService
import com.google.common.base.Strings
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.TransactionPipe
import java.sql.Connection
import java.util.logging.Level
import java.util.logging.Logger
import java.util.regex.Pattern

class AuthPipe(val transactionPipe: TransactionPipe) {

    fun <T> handle(authorization: String, lang: LanguageHolder, clientVersion:String, c: (con: Connection, loginHolder: LoginService.LoginInfo) -> T): T {
        var result: T? = null

        transactionPipe.handle { con ->
            val auth = LoginService(con, lang, clientVersion).allowAccess(extractToken(authorization))
            try {
                result = c(con, auth)
            } catch (e: Throwable) {
                Logger.getLogger(AuthPipe::class.java.name).log(Level.SEVERE,
                        """
                            Following Exception occured with user
                            id: ${auth.id};
                            email: ${auth.loginSerialized.<%-accountColumn.name%>};
                            clientVersion: ${clientVersion}
                            """)
                throw e
            }
        }

        return result!!
    }

    companion object {
        fun extractToken(authorization: String): String? {
            if (Strings.isNullOrEmpty(authorization)) {
                return null
            }

            val matcher = Pattern.compile("Bearer (.*)").matcher(authorization)

            return if (!matcher.find()) {
                null
            } else matcher.group(1)
        }
    }

}