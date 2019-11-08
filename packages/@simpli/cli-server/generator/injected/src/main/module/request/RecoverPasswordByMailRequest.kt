<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.request

import br.com.simpli.model.LanguageHolder
import br.com.simpli.tools.Validator
import javax.ws.rs.BadRequestException
import javax.xml.bind.annotation.XmlRootElement

/**
 * Recover Password By Mail Request Model
 * @author Simpli CLI generator
 */
@XmlRootElement
class RecoverPasswordByMailRequest(var email: String?) {
    fun validate(lang: LanguageHolder) {
        if (email.isNullOrEmpty()) {
            throw BadRequestException(lang.cannotBeNull("Email"))
        }

        if (!Validator.isEmail(email)) {
            throw BadRequestException(lang.isNotAValidEmail("Email"))
        }
    }
}
