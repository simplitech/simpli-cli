<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.mail

import <%-packageAddress%>.wrapper.MailWrapper
import <%-packageAddress%>.model.User
import br.com.simpli.model.LanguageHolder

/**
 * Reset Password E-Mail handle
 * @author Simpli CLI generator
 */
class ResetPasswordMail(lang: LanguageHolder, user: User, hash: String) : MailWrapper(lang) {
    init {
        this.to = user.email!!
        this.subject = "Password Recovery"

        data["linkUrl"] = """$appUrl/#/password/recover/$hash"""
        data["linkUnsubscribeUrl"] = "#"

        setBodyFromTemplate(this::class.java, data, "forgotPassword.html")
    }
}
