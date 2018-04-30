<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>

import com.google.common.base.Strings
import com.simpli.model.EnglishLanguage
import com.simpli.model.LanguageHolder
import com.simpli.model.PortugueseLanguage
import com.simpli.model.RespException
import com.simpli.sql.TransactionPipe
import java.util.*
import java.util.logging.Level
import java.util.logging.Logger
import java.util.regex.Matcher
import java.util.regex.Pattern
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

/**
 * Utility class holding properties and methods for all Routers
 * @author Simpli© CLI generator
 */
open class RouterWrapper : ExceptionMapper<Throwable> {
    protected var pipe = TransactionPipe("jdbc/<%-database%>DS")

    protected val langs: HashMap<String, LanguageHolder> = object : HashMap<String, LanguageHolder>() {
        init {
            put("en-US", EnglishLanguage())
            put("pt-BR", PortugueseLanguage())
        }
    }

    fun getLang(lang: String = "en-US"): LanguageHolder {
        return langs[lang] ?: EnglishLanguage()
    }

    override fun toResponse(e: Throwable): Response {
        Logger.getLogger(RouterWrapper::class.java.name).log(Level.SEVERE, e.message, e)

        if (e is RespException) {
            var code = ""
            if (e.code != null) {
                code = "\"code\": " + e.code + ", "
            }

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{" + code + " \"message\": \"" + e.message + "\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build()
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Internal Server Error\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build()
        }
    }

    protected fun extractToken(authorization: String): String? {
        if (Strings.isNullOrEmpty(authorization)) {
            return null
        }

        val matcher = Pattern.compile("Bearer (.*)").matcher(authorization)

        return if (!matcher.find()) {
            null
        } else matcher.group(1)
    }
}
