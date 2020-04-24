<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.request

import br.com.simpli.model.LanguageHolder
import javax.ws.rs.BadRequestException

/**
 * Reset Password Request Model
 * @author Simpli CLI generator
 */
class ResetPasswordRequest(var newPassword: String?, var confirmPassword: String?, var hash: String?) {
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
