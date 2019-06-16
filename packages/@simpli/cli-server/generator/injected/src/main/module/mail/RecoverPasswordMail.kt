<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.mail

import <%-packageAddress%>.wrapper.MailWrapper
import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import br.com.simpli.model.LanguageHolder

/**
 * Recover Password E-Mail handler
 * @author Simpli CLI generator
 */
class RecoverPasswordMail(lang: LanguageHolder, <%-userTable.instanceName%>: <%-userTable.modelName%>, hash: String) : MailWrapper(lang) {
    init {
        to = "${<%-userTable.instanceName%>.<%-accountColumn.name%>}"
        subject = lang["email_reset_password_subject"]

        data["title"] = lang["email_reset_password_title"]
        data["subtitle"] = lang["email_reset_password_subtitle"]
        data["body"] = lang["email_reset_password_body"]
        data["textButton"] = lang["email_reset_password_text_button"]
        data["labelButton"] = lang["email_reset_password_label_button"]
        data["linkButton"] = """$appUrl/#/password/reset/$hash"""

        setBodyFromTemplate(this::class.java, data, "template.html")
    }
}
