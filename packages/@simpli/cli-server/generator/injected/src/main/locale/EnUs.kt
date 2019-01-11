<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.locale

import br.com.simpli.model.EnglishLanguage

/**
 * USA English language
 * @author Simpli CLI generator
 */
class EnUs : EnglishLanguage() {
    init {
        dictionary = hashMapOf(
                "access_denied" to "Access Denied",
                "already_exists" to "It is not possible to create an already existing item",
                "does_not_exist" to "It is not possible to edit a non-existing item",
                "invalid_token" to "Invalid Token",
                "user_id_not_found" to "UserRouter ID Not Found",
                "user_not_found" to "UserRouter Not Found",
                "wrong_password" to "Wrong password",
                "password_no_match" to "The field password must match",
                "something_went_wrong" to "Something wend wrong. Contact the admin!"
        )
    }
}
