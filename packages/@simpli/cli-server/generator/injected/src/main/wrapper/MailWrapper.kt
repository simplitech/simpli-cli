<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Env.APP_DEFAULT_ORIGIN
import <%-packageAddress%>.app.Env.EMAIL_AWS_REGION
import <%-packageAddress%>.app.Env.EMAIL_SENDER_NAME
import <%-packageAddress%>.app.Env.EMAIL_SENDER_PROVIDER
import br.com.simpli.model.LanguageHolder
import br.com.simpli.ws.AWSSendEmailRequest
import java.util.HashMap

/**
 * Mail Wrapper
 * Extended class of e-mail processes
 * @author Simpli CLI generator
 */
abstract class MailWrapper(protected val lang: LanguageHolder) : AWSSendEmailRequest(EMAIL_AWS_REGION) {
    protected var data = HashMap<String, String>()
    protected val appUrl = APP_DEFAULT_ORIGIN

    init {
        this.from = EMAIL_SENDER_PROVIDER
        this.name = EMAIL_SENDER_NAME

        data["appUrl"] = appUrl
    }
}
