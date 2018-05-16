<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.mail

import <%-packageAddress%>.AppMail
import <%-packageAddress%>.model.User
import com.simpli.model.LanguageHolder

class ResetPasswordMail(appUrl: String, lang: LanguageHolder, user: User, hash: String) : AppMail(appUrl, lang) {
    init {
        this.to = user.email!!
        this.subject = "Password Recovery"

        data.put("linkUrl", """$appUrl/#/password/recover/$hash""")
        data.put("linkUnsubscribeUrl", "#")

        setBodyFromTemplate(this::class.java, data, "forgotPassword.html")
    }
}
