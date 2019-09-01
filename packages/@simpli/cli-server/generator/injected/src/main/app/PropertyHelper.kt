<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import br.com.simpli.ws.AwsFileManager
import java.io.IOException
import java.util.Properties
import java.util.logging.Level
import java.util.logging.Logger

/**
 * Property Helper
 * @author Simpli CLI generator
 */
class PropertyHelper(file: String) {
    private val p: Properties

    init {
        val inputStream = this.javaClass.getResourceAsStream(file)
        p = Properties()

        try {
            p.load(inputStream)
        } catch (ex: IOException) {
            Logger.getLogger(AwsFileManager::class.java.name).log(Level.SEVERE, null, ex)
        }

    }

    operator fun get(key: String): String {
        return p.getProperty(key)
    }
}
