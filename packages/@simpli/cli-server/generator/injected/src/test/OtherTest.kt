<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>

import <%-packageAddress%>.AppProvider.DateParameterConverter
import com.google.gson.Gson
import java.util.Date
import org.junit.Test
import kotlin.test.assertNotNull

/**
 * Test other services
 * @author Simpli© CLI generator
 */
class OtherTest {
    @Test
    fun testAppProvider() {
        val appProvider = AppProvider()

        val context = appProvider.getContext(null)
        val converter = appProvider.getConverter(Date::class.java, null, null) as DateParameterConverter?

        assertNotNull(context)
        assertNotNull(converter)
    }
}
