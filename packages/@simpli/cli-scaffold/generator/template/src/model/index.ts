<%_ var resources = rootOptions.scaffoldSetup.exceptPagedRespModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
export {<%-resource.name%>} from '<%-resource.modulePath%>'
<%_ } _%>

export {PagedResp} from '@/model/collection/PagedResp'
