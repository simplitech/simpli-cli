<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.request

import br.com.simpli.model.LanguageHolder
import io.swagger.annotations.ApiModel
import javax.ws.rs.BadRequestException

/**
 * Recover Password Request Model
 * @author Simpli CLI generator
 */
@ApiModel(value = "RecoverPasswordRequest")
class RecoverPasswordRequest(val newPassword: String?, val confirmPassword: String?, val hash: String?) {
    fun validate(lang: LanguageHolder) {
        if (newPassword.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("New Password"))
        }

        if (confirmPassword.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("Confirm Password"))
        }

        if (newPassword != confirmPassword) {
            throw BadRequestException(lang["password_no_match"])
        }

        if (hash.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("Hash"))
        }
    }
}
