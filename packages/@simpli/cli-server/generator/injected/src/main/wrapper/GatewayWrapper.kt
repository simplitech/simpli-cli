<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Env.AVAILABLE_LANGUAGES
import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.locale.EnUs
import <%-packageAddress%>.param.DefaultParam
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.ConnectionPipe
import java.sql.Connection
import java.util.regex.Pattern

/**
 * Gateway Wrapper
 * Extended class of gateways
 * @author Simpli CLI generator
 */
abstract class GatewayWrapper {
    lateinit var pipe: ConnectionPipe

    open fun onAssign() {/**/}

    fun assign(pipe: ConnectionPipe) {
        this.pipe = pipe
        onAssign()
    }

    companion object {
        fun getLang(code: String?): LanguageHolder = AVAILABLE_LANGUAGES[Lang.from(code)] ?: EnUs()

        fun extractToken(authorization: String): String? {
            val matcher = Pattern.compile("Bearer (.*)").matcher(authorization)
            return if (matcher.find()) matcher.group(1) else null
        }
    }
}
