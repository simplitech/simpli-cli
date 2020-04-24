<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Facade.Env
import br.com.simpli.model.LanguageHolder
import br.com.simpli.ws.AWSSendEmailRequest
import java.util.HashMap

/**
 * Mail Wrapper
 * Extended class of e-mail processes
 * @author Simpli CLI generator
 */
abstract class MailWrapper(protected val lang: LanguageHolder) : AWSSendEmailRequest(Env.EMAIL_AWS_REGION) {
    protected var data = HashMap<String, String>()
    protected val appUrl = Env.APP_DEFAULT_ORIGIN

    init {
        from = Env.EMAIL_SENDER_PROVIDER
        name = lang["email_sender_name"]

        data["appUrl"] = appUrl

        data["logoUrl"] = """$appUrl/img/logo.png"""
        data["logoWidth"] = "300"
        data["bgColor"] = "#F5F5F5"

        data["signature"] = name
        data["emailContact"] = lang["email_contact"]

        data["linkFacebook"] = lang["email_link_facebook"]
        data["linkInstagram"] = lang["email_link_instagram"]
        data["linkTwitter"] = lang["email_link_twitter"]
        data["linkYoutube"] = lang["email_link_youtube"]
        data["linkLinkedin"] = lang["email_link_linkedin"]
    }
}
