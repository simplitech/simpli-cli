<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.request

import br.com.simpli.model.LanguageHolder
import br.com.simpli.tools.Validator
import io.swagger.annotations.ApiModel
import javax.ws.rs.BadRequestException

/**
 * Reset Password Request Model
 * @author Simpli CLI generator
 */
@ApiModel(value = "ResetPasswordRequest")
class ResetPasswordRequest(val email: String?) {
    fun validate(lang: LanguageHolder) {
        if (email.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("E-Mail"))
        }

        if (!Validator.isEmail(email)) {
            throw BadRequestException(lang.isNotAValidEmail("E-Mail"))
        }
    }
}
