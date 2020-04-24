<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.request

import <%-packageAddress%>.exception.response.BadRequestException
import br.com.simpli.model.LanguageHolder

/**
 * Change Password Request Model
 * @author Simpli CLI generator
 */
class ChangePasswordRequest(var currentPassword: String?, var newPassword: String?, var confirmPassword: String?) {
    fun validate(lang: LanguageHolder) {
        if (currentPassword.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("Current Password"))
        }

        if (newPassword.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("New Password"))
        }

        if (confirmPassword.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("Confirm Password"))
        }

        if (newPassword != confirmPassword) {
            throw BadRequestException(lang["password_no_match"])
        }
    }
}
