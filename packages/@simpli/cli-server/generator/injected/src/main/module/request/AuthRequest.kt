<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
<%_ var startCase = options.serverSetup.startCase _%>
package <%-packageAddress%>.<%-moduleName%>.request

import br.com.simpli.model.LanguageHolder
import br.com.simpli.tools.Validator
import io.swagger.v3.oas.annotations.media.Schema
import <%-packageAddress%>.<%-moduleName%>.auth.AuthProcess
import <%-packageAddress%>.exception.response.BadRequestException

/**
 * Authentication Request Model
 * @author Simpli CLI generator
 */
class AuthRequest(var <%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, var <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?) {
    fun validate(lang: LanguageHolder) {
        if (<%-accountColumn.name%>.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("<%-startCase(accountColumn.name)%>"))
        }

        if (!Validator.isEmail(<%-accountColumn.name%>)) {
            throw BadRequestException(lang.isNotAValidEmail("<%-startCase(accountColumn.name)%>"))
        }

        if (<%-passwordColumn.name%>.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("<%-startCase(passwordColumn.name)%>"))
        }
    }

    @Schema(hidden = true)
    fun toToken() = AuthProcess.requestToToken(this)
}
