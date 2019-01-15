<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.mail

import <%-packageAddress%>.wrapper.MailWrapper
import <%-packageAddress%>.model.<%-userTable.modelName%>
import br.com.simpli.model.LanguageHolder

/**
 * Reset Password E-Mail handle
 * @author Simpli CLI generator
 */
class ResetPasswordMail(lang: LanguageHolder, <%-userTable.instanceName%>: <%-userTable.modelName%>, hash: String) : MailWrapper(lang) {
    init {
        this.to = <%-userTable.instanceName%>.<%-accountColumn.name%>!!
        this.subject = "Password Recovery"

        data["linkUrl"] = """$appUrl/#/password/recover/$hash"""
        data["linkUnsubscribeUrl"] = "#"

        setBodyFromTemplate(this::class.java, data, "forgotPassword.html")
    }
}
