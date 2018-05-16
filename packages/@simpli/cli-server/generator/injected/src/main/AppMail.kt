<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var projectDomain = options.serverSetup.projectDomain _%>
<%_ var serverName = options.serverSetup.serverName _%>
package <%-packageAddress%>

import com.simpli.model.LanguageHolder
import com.amazonaws.regions.Regions
import com.simpli.tools.AWSSendEmailRequest

import java.util.HashMap

open class AppMail(appUrl: String, lang: LanguageHolder) : AWSSendEmailRequest(Regions.US_EAST_1) {
    protected var data: MutableMap<String, Any> = HashMap()

    init {
        this.from = "no-reply@<%-projectDomain%>"
        this.name = "<%-serverName%>"

        data["appUrl"] = appUrl
    }
}
