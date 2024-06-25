import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConstants {
  static getWhereCond: { searchType: any; text: any; dropdown: any; dropdown2: any; dropdown3: any; }[];
  static AddCdsProject<T>(AddCdsProject: any, formData: FormData, arg2: { headers: HttpHeaders; }) {
    throw new Error('Method not implemented.');
  }

  // --------------------------------------------------------------------------------
  // -- Globally used headers in API requests
  // --------------------------------------------------------------------------------
  public static headerstext = new HttpHeaders().set('Content-Type', 'text');

  public static headers = new HttpHeaders().set('Content-Type', 'application/json');
  public static loginHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  // --------------------------------------------------------------------------------
  // -- Globally used parameterspublic
  // --------------------------------------------------------------------------------
  public static sessionTimeOutCounter: any = 1000 * 600 * 600;
  // Changes on endpoint URL must be done here
  public static endPointAddress = "10.1.8.36";

  // --------------------------------------------------------------------------------
  // -- API Gateways
  // --------------------------------------------------------------------------------
  //public static usmGateway2 = "http://" + GlobalConstants.endPointAddress + ":8088/usm/";
  public static usmGateway = "http://" + GlobalConstants.endPointAddress + ":8112/usm/";
  public static cdsGateway = "http://" + GlobalConstants.endPointAddress + ":8112/cds/";
  public static qbeGateway = "http://" + GlobalConstants.endPointAddress + ":8112/qbe/";
  public static wfmGatewat = "http://" + GlobalConstants.endPointAddress + ":8112/wfm/";
  public static inviaGatewat = "http://" + GlobalConstants.endPointAddress + ":8112/invia/";
  public static inDispGatewat = "http://" + GlobalConstants.endPointAddress + ":8112/inDisplay/";
  // --------------------------------------------------------------------------------
  // -- Login Elements
  // --------------------------------------------------------------------------------
  public static loginApi = GlobalConstants.usmGateway + 'api/login';
  // public static loginApiJWT = "http://" + GlobalConstants.endPointAddress + ":8222/auth/realms/usm-realm/protocol/openid-connect/token";
  // public static clientId = "usm-client";
  // public static grantType = "password";

  // --------------------------------------------------------------------------------
  // -- USM APIs used in the application
  // --------------------------------------------------------------------------------
  public static fetchUSMAppMenuComboApi = GlobalConstants.usmGateway + 'api/getUSMApplicationMenu/';

  public static fetchUSMLdapConfCombo = GlobalConstants.usmGateway + 'api/getAddRoleMappingLdapConfCombo/';
  public static fetchUSMObjectTypeCombo = GlobalConstants.usmGateway + 'api/usmObjectTypeCombo/';
  public static fetchUSMUsersRoleLDAP = GlobalConstants.usmGateway + 'api/USMRoleMapping/';
  public static fetchUSMUsersOfRoleApi = GlobalConstants.usmGateway + 'api/usmroleusers/';
  public static fetchUSMBugTypesComboApi = GlobalConstants.usmGateway + 'api/usmBugTypeCombo/';
  public static fetchRoleBugNameComboApi = GlobalConstants.usmGateway + 'api/getRoleBugNameCombo/';
  public static addUSMRoleApi = GlobalConstants.usmGateway + 'api/usmrole/add/';
  public static addUSMRoleLDAPApi = GlobalConstants.usmGateway + 'api//usmadd/add';
  public static deleteUSMRoleApi = GlobalConstants.usmGateway + 'api/usmrole/delete/';
  public static deleteApp = GlobalConstants.usmGateway + 'api/DeleteUSMApplication/';
  public static deleteUSMRoleLDAP = GlobalConstants.usmGateway + 'api/usmdelete/delete/';
  public static fetchUSMRoleApi = GlobalConstants.usmGateway + 'api/usmrole/';
  public static updateUSMRoleApi = GlobalConstants.usmGateway + 'api/usmrole/update/';
  //public static updateAccessRightsApi = GlobalConstants.usmGateway + 'api/USMAccess/update/';
  public static fetchUSMRolesApi = GlobalConstants.usmGateway + 'api/usmroles/';
  public static fetchUSMRolesAppComboApi = GlobalConstants.usmGateway + 'api/comboAppType/';
  public static getUSMApplicationRelatedUserId = GlobalConstants.usmGateway + 'api/getUSMApplicationRelatedUserId/';
  public static getUSMApplicationRelatedRoleId = GlobalConstants.usmGateway + 'api/getUSMApplicationRelatedRoleId/';
  public static fetchUSMRolesAppComboByIdApi = GlobalConstants.usmGateway + 'api/getUSMApplicationComboById/';
  public static fetchPeriodPwdSettingsComboApi = GlobalConstants.usmGateway + 'api/getSyslinesPeriod/';
  public static fetchUSMRolesRoleTypeComboApi = GlobalConstants.usmGateway + 'api/getSyslines/';
  public static addUSMUserApi = GlobalConstants.usmGateway + 'api/usmuser/add/';
  public static AddApplicationInAccessRight = GlobalConstants.usmGateway + 'api/AddUSMApplication';
  public static deleteUSMUserApi = GlobalConstants.usmGateway + 'api/usmuser/delete/';
  public static fetchUSMUserApi = GlobalConstants.usmGateway + 'api/usmuser/';
  public static updateUSMUserApi = GlobalConstants.usmGateway + 'api/usmuser/update/';
  public static fetchUSMUsersApi = GlobalConstants.usmGateway + 'api/usmusers/';
  public static fetchUSMStatusComboApi = GlobalConstants.usmGateway + 'api/getStatusCombo/';
  public static fetchUSMLanguageComboApi = GlobalConstants.usmGateway + 'api/getLanguageCombo/';
  public static fetchUSMBugTypeComboApi = GlobalConstants.usmGateway + 'api/getBugTypeCombo/';
  public static fetchUSMCivilStatusApi = GlobalConstants.usmGateway + 'api/getCivilStatusCombo';
  public static fetchUSMCurrencyApi = GlobalConstants.usmGateway + 'api/getCurrencyCombo';
  public static fetchUSMBugNameApi = GlobalConstants.usmGateway + 'api/getBugNameCombo';
  public static fetchUSMRoleNameApi = GlobalConstants.usmGateway + 'api/getRoleCombo';
  public static fetchUSMDefaultRoleNameApi = GlobalConstants.usmGateway + 'api/getDefaultRoleCombo';
  public static fetchLoggedInUserDataApi = GlobalConstants.usmGateway + '/api/usmuser/usernameContains/';
  public static fetchUSMProfileApi = GlobalConstants.usmGateway + 'api/usmprofiles';
  public static fetchMenuApi = GlobalConstants.usmGateway + 'api/menu/';
  public static checkIsMenuManaged = GlobalConstants.usmGateway + 'api/menuIsManaged/';
  public static checkAccessRight = GlobalConstants.usmGateway + 'api/accessRight/';
  public static fetchUserCombo = GlobalConstants.usmGateway + 'api/getUserCombo';
  public static fetchUSMFieldApi = GlobalConstants.usmGateway + 'api/getFieldCombo';
  // fetchUSMFieldApi
  public static fetchApplicationCombo = GlobalConstants.usmGateway + 'api/getUSMApplication';
  public static getLogsByUserApi = GlobalConstants.usmGateway + 'api/getAllLogsByUser/';
  public static getInvalidLogsApi = GlobalConstants.usmGateway + 'api/getAllInvalidLogs/';
  // public static getApplicationCombo = GlobalConstants.usmGateway + 'api/getApplicationObjectCombo/';
  public static getMenuName = GlobalConstants.usmGateway + 'api/getMenuName/';
  public static getObjectLogsApi = GlobalConstants.usmGateway + 'api/getAllLogsByObject/';
  public static getFieldHistoryLog = GlobalConstants.usmGateway + 'api/getAllFieldHistoryLog';
  // public static getLogsByHeatmap=GlobalConstants.usmGateway + 'api/getAllLogsByHeatmap';
  public static getLogsByHeatmap = GlobalConstants.usmGateway + 'api/generateHeatMapTable';
  public static postPasswdSettings = GlobalConstants.usmGateway + 'api/PostPasswdSettings';
  public static postAccessrights = GlobalConstants.usmGateway + 'api/updateAccessRightsApi/';
  public static getUSMProfileApi = GlobalConstants.usmGateway + 'api/profiles/';
  public static getUSMApplicationComboApi = GlobalConstants.usmGateway + 'api/getUSMApplication/';
  public static getUSMProfileByIdApi = GlobalConstants.usmGateway + 'api/profile/';
  public static addUSMProfileApi = GlobalConstants.usmGateway + 'api/profile/add/';
  public static deleteUSMProfileApi = GlobalConstants.usmGateway + 'api/profile/delete/';
  public static updateUSMProfileApi = GlobalConstants.usmGateway + 'api/profile/update/';
  public static updateUSMUsersRoleApi = GlobalConstants.usmGateway + 'api/usmUsersRole/';
  public static getUSMAccessRightsApi = GlobalConstants.usmGateway + 'api/getUSMAccessRightsApi/';
  public static getUSMPwdExpPeriodApi = GlobalConstants.usmGateway + 'api/getPwdExpPeriodCombo/';
  //public static fetchUSMInvalidLoginApi: any;
  //public static fetchUSMFieldHistoryLog: any;
  //public static fetchUSMUSMApplicationComboApi: any;
  public static fetchUSMUserComboApi: any;
  public static fetchUSMMenuComboApi: any;
  public static getUSMApplicationEvent = GlobalConstants.usmGateway + 'api/getApplicationEvent/';
  static fetchLogsByObject: any;
  static fetchLogsByUser: any;

  public static deleteLdapConfigApi = GlobalConstants.usmGateway + 'api/ldapconfiguration/delete/';
  public static addLdapConfigApi = GlobalConstants.usmGateway + 'api/ldapconfiguration/add/';
  public static updateLdapConfigApi = GlobalConstants.usmGateway + 'api/ldapconfiguration/update/';
  public static fetchLdapApi = GlobalConstants.usmGateway + 'api/ldapconfiguration/';
  public static fetchBugLdap = GlobalConstants.usmGateway + 'api/getAddRoleMappingLdapConfCombo/';
  public static fetchLdapConfigurationInfos = GlobalConstants.usmGateway + 'api/ldapconfigurations/';
  public static fetchCaptchaCode = GlobalConstants.usmGateway + 'api/fetchCaptchaCode';
  public static checkCaptcha = GlobalConstants.usmGateway + 'api/checkCaptcha/';
  public static getAccessRightsGrid = GlobalConstants.usmGateway + 'api/getAccessRightsGrid/';

  // --------------------------------------------------------------------------------
  // -- CDS APIs used in the application
  // --------------------------------------------------------------------------------
  // public static fetchMapIdApi = GlobalConstants.cdsGateway + 'api//';
  // public static fetchSrcApi = GlobalConstants.cdsGateway + 'api//';
  // public static fetchDestinationApi = GlobalConstants.cdsGateway + 'api//';
  // public static fetchStatusApi = GlobalConstants.cdsGateway + 'api//';
  public static fetchMappingApi = GlobalConstants.cdsGateway + 'api/getMappingData';
  public static fetchCDSComboApi = GlobalConstants.cdsGateway + 'api/getMappingComboData/';
  public static fetchCDSTypeComboApi = GlobalConstants.cdsGateway + 'api/file/types';
  public static fetchCDSListOfTypeComboApi = GlobalConstants.cdsGateway + 'api/listOfType/dataType';
  public static fetchCDSProjectComboApi = GlobalConstants.cdsGateway + 'api/getFlowType';
  // public static fetchCDSDocData = GlobalConstants.cdsGateway + 'api/getDocData';
  public static addCDSMappingApi = GlobalConstants.cdsGateway + 'api/mapping/add';
  public static updateCDSDocData = GlobalConstants.cdsGateway + 'api/cdsMapping/update/';
  public static fetchCDSDocDataById = GlobalConstants.cdsGateway + 'api/cdsMapping/getDataById/';

  public static getCdsCrossRefApi = GlobalConstants.cdsGateway + 'api/getAllCdsCrossReferencingRecords';

  public static fetchCDSdefinitionApi = GlobalConstants.cdsGateway + 'api/documents';



  public static fetchProjectApi = GlobalConstants.cdsGateway + 'api/cdsprojects';
  public static addProjectsApi = GlobalConstants.cdsGateway + 'api/cdsproject/add/';
  public static updateProjectApi = GlobalConstants.cdsGateway + 'api/cdsproject/update/';
  public static getProjectApi = GlobalConstants.cdsGateway + 'api/cdsprojectData/';
  public static deletProjectApi = GlobalConstants.cdsGateway + 'api/cdsproject/delete/';





  public static fetchStatutsForm = 'http://10.1.8.26:8091/api/StatusItemsAllocation/';


  // // --------------------------------------------------------------------------------
  // -- QBE APIs used in the application
  // --------------------------------------------------------------------------------
  public static fetchQbeMappingApi = GlobalConstants.qbeGateway + 'api/getAllQueries';
  public static addQueryData = GlobalConstants.qbeGateway + 'api/addQueryData';
  public static deleteQueryData = GlobalConstants.qbeGateway + 'api/deleteQueryData/';
  public static validateQuery = GlobalConstants.qbeGateway + 'api/validateQuery/';
  public static cqlValidateQuery = GlobalConstants.qbeGateway + 'api/cqlValidateQuery/';

  public static fetchDynamicData = GlobalConstants.qbeGateway + 'api/fetchDynamicData/';
  public static cqlFetchDynamicData = GlobalConstants.qbeGateway + 'api/cqlFetchDynamicData/';

  public static fetchDynamicHeaderData = GlobalConstants.qbeGateway + 'api/fetchDynamicHeaderData/';
  public static addParamSession = GlobalConstants.qbeGateway + 'api/addParamSession/';
  public static getParamSession = GlobalConstants.qbeGateway + 'api/getParamSession/';
  public static getParamCombo = GlobalConstants.qbeGateway + 'api/getParamCombo/';
  public static getParamTypes = GlobalConstants.qbeGateway + 'api/getParamTypes';
  public static getHeaderData = GlobalConstants.qbeGateway + 'api/getHeaderData/';
  public static updateParamSession = GlobalConstants.qbeGateway + 'api/updateParamSession/';
  public static deleteParameter = GlobalConstants.qbeGateway + 'api/deleteParameter/';
  public static decodeQuery = GlobalConstants.qbeGateway + 'api/decodeQuery/';
  public static updateQuery = GlobalConstants.qbeGateway + 'api/updateQuery/';
  public static deleteSessions = GlobalConstants.qbeGateway + 'api/deleteSessions/';
  public static exportQuery = GlobalConstants.qbeGateway + 'api/exportQuery/';
  public static importQuery = GlobalConstants.qbeGateway + 'api/importQuery/';
  public static getSubQueries = GlobalConstants.qbeGateway + 'api/getSubQueries/';
  public static getQueryParamsLookup = GlobalConstants.qbeGateway + 'api/getQueryParamsLookup/';
  public static getQueryList=GlobalConstants.qbeGateway + 'api/getQueryList/';
  public static getQueryParams=GlobalConstants.qbeGateway + 'api/getQueryParams/';
  public static getQueryType=GlobalConstants.qbeGateway + 'api/getQueryType/';
  public static fetchDynamicDataQueryForm  = GlobalConstants.qbeGateway + 'api/fetchDynamicDataQueryForm/';
  public static insertQueryTypeApi  = GlobalConstants.qbeGateway + 'api/insertQueryType/';
  public static updateQueryTypeApi  = GlobalConstants.qbeGateway + 'api/updateQueryType/';
  public static checkQueryTypeExistsApi  = GlobalConstants.qbeGateway + 'api/checkQueryTypeExists/';
  public static getSecurityUserQuery =  GlobalConstants.qbeGateway + 'api/getSecurityUserQuery/';
  public static getQueryListUsers =  GlobalConstants.qbeGateway + 'api/getQueryListUsers/';
  public static addQbeAuthorizedUsers =  GlobalConstants.qbeGateway + 'api/addQbeAuthorizedUsers';
  public static deleteQbeAuthorizedUsers =  GlobalConstants.qbeGateway + 'api/deleteQbeAuthorizedUsers/';
  public static deleteQbeSecurityChanges =  GlobalConstants.qbeGateway + 'api/deleteQbeSecurityChanges';
  public static getQbeQueryCreatedBy =  GlobalConstants.qbeGateway + 'api/getQbeQueryCreatedBy/';

  


  
  //---------REPORT BUILDER-----------////
  public static executeReport=GlobalConstants.qbeGateway + 'api/executeReport/';
  public static getReportsData=GlobalConstants.qbeGateway + 'api/getReportsData/';
  public static getAllTables = GlobalConstants.qbeGateway + 'api/getAllTables/'
  public static getTableColumns = GlobalConstants.qbeGateway + 'api/getTableColumns/'
  public static executeReportwithOneParam=GlobalConstants.qbeGateway + 'api/executeReportwithOneParam/';
  public static executeReportParam=GlobalConstants.qbeGateway + 'api/executeReportParam/';
  public static addNewReport=GlobalConstants.qbeGateway + 'api/addNewReport/';
  public static deleteReport=GlobalConstants.qbeGateway + 'api/deleteReport/';
  public static updateReport=GlobalConstants.qbeGateway + 'api/updateReport/';
  public static checkParameters=GlobalConstants.qbeGateway + 'api/checkParameters/';
  public static executeReportwithParameters=GlobalConstants.qbeGateway + 'api/executeReportwithParameters/';


  // --------------------------------------------------------------------------------
  // -- WFM APIs used in the application
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // -- INVIA APIs used in the application
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // -- IN Display APIs used in the application
  public static fetchInDispMappingApi = GlobalConstants.inDispGatewat + 'api/getAllMenus';
  public static fetchInDispTablesApi = GlobalConstants.inDispGatewat + 'api/getAllTables';
  public static createFormBuilder = GlobalConstants.inDispGatewat + 'api/createFormBuilder';
  public static getNewMenuNameApi = GlobalConstants.inDispGatewat + 'api/getNewMenuName/';
  public static getAllTabs = GlobalConstants.inDispGatewat + 'api/getAllTabs/';
  public static getColumnsApi = GlobalConstants.inDispGatewat + 'api/getAllColumns/';
  public static getAllButtons = GlobalConstants.inDispGatewat + 'api/getAllButtons/';
  public static getAllColumnsSuspended = GlobalConstants.inDispGatewat + 'api/getAllColumnsNotSuspended/';
  public static getSyslinesDataApi = GlobalConstants.inDispGatewat + 'api/getSysLinesData/';
  public static getSysLinesDataWithIdsApi = GlobalConstants.inDispGatewat + 'api/getSysLinesDataWithIds/';
  public static deleteFormBuilderApi = GlobalConstants.inDispGatewat + 'api/deleteFormBuilder/';
  public static tableNameComboApi = GlobalConstants.inDispGatewat + 'api/getAllTable/';
  public static createTabApi = GlobalConstants.inDispGatewat + 'api/createTab/';
  public static getPreviewColumnsApi = GlobalConstants.inDispGatewat + 'api/getPreviewColumns/';
  public static getTabConfigurationApi = GlobalConstants.inDispGatewat + 'api/getTabConfiguration/';
  public static updateTabApi = GlobalConstants.inDispGatewat + 'api/updateTab/';
  public static getMenuNameApi = GlobalConstants.inDispGatewat + 'api/getMenuName/';
  public static deleteTabApi = GlobalConstants.inDispGatewat + 'api/deleteTab/';
  public static columnModifierApi = GlobalConstants.inDispGatewat + 'api/columnModifier/';
  public static getTableGroupingApi = GlobalConstants.inDispGatewat + 'api/getGroupingTables/';
  public static getTabTables = GlobalConstants.inDispGatewat + 'api/getTabTables/';
  public static getTabTables2 = GlobalConstants.inDispGatewat + 'api/getTabTables2/';
  public static getTabTablesFormRecords = GlobalConstants.inDispGatewat + 'api/getTabTablesFormRecords/'
  public static getSourceQueryApi = GlobalConstants.inDispGatewat + 'api/getSourceQuery/';
  public static getSelectedRowsApi = GlobalConstants.inDispGatewat + 'api/getSelectedRows/';
  public static updateGridApi = GlobalConstants.inDispGatewat + 'api/updateGrid/';
  public static getColumnConfigurationApi = GlobalConstants.inDispGatewat + 'api/getColumnConfiguration/';
  public static previewInsertDynamicApi = GlobalConstants.inDispGatewat + 'api/insertDynQuery';
  public static getDynamicGridHeaders = GlobalConstants.inDispGatewat + 'api/getDynamicGridHeaders';
  public static getDynamicGridData = GlobalConstants.inDispGatewat + 'api/getDynamicGridData/';
  public static getDynamicFormData = GlobalConstants.inDispGatewat + 'api/getDynamicFormData/';
  public static getColumnIdApi = GlobalConstants.inDispGatewat + 'api/getColumnId/';
  public static updateDynForm = GlobalConstants.inDispGatewat + 'api/updateDynForm/';
  public static getButtonPosition = GlobalConstants.inDispGatewat + 'api/getButtonPosition';
  public static getAllFieldSets = GlobalConstants.inDispGatewat + 'api/getAllFieldSets/';
  public static addFieldSetApi = GlobalConstants.inDispGatewat + 'api/addFieldSet/';
  public static updateFieldSetApi = GlobalConstants.inDispGatewat + 'api/updateFieldSet/';
  public static getAllFieldSetsApi = GlobalConstants.inDispGatewat + 'api/getAllFieldSets/';
  public static getFieldSetDataApi = GlobalConstants.inDispGatewat + 'api/getFieldSetData/';
  public static getButtonDataApi = GlobalConstants.inDispGatewat + 'api/getButtonData/';
  public static createFormButton = GlobalConstants.inDispGatewat + 'api/createFormButton/';
  public static updateFormButton = GlobalConstants.inDispGatewat + 'api/updateFormButton/';
  public static getMenusButton = GlobalConstants.inDispGatewat +'api/getMenusButton';
  public static deleteButton = GlobalConstants.inDispGatewat +'api/deleteButton/';
  public static checkColumnsExist = GlobalConstants.inDispGatewat + 'api/checkColumnsExist/';
  public static getTableInfo = GlobalConstants.inDispGatewat + 'api/getTableInfo/';
  public static fieldOrderManagement = GlobalConstants.inDispGatewat + 'api/fieldOrderManagement/';
  public static updateFieldOrder = GlobalConstants.inDispGatewat + 'api/updateFieldOrder/';
  public static getAllProcAndPack = GlobalConstants.inDispGatewat + 'api/getAllProcAndPack/';
  public static insertCustomField = GlobalConstants.inDispGatewat + 'api/insertCustomField/';
  public static getFieldDependencies = GlobalConstants.inDispGatewat + 'api/getFieldDependencies/';
  public static getTablesLinkedToForm = GlobalConstants.inDispGatewat + 'api/getTablesLinkedToForm/';
  public static getColNameByColumnId = GlobalConstants.inDispGatewat + 'api/getColNameByColumnId/';
  public static fetchDialNums = GlobalConstants.inDispGatewat + 'api/fetchDialNums/';
  public static getColumnsQuery = GlobalConstants.inDispGatewat + 'api/getColumnsQuery/';
  public static getQueryFormButton = GlobalConstants.inDispGatewat + 'api/getQueryFormButton/';
  public static getQueryFormButtonJSON  = GlobalConstants.inDispGatewat + 'api/getQueryFormButtonJSON/';
  public static getDynReports  = GlobalConstants.inDispGatewat + 'api/getDynReports/';
  public static insertDynamicReportFormApi  = GlobalConstants.inDispGatewat + 'api/insertDynamicReportForm/';
  public static insertDynamicReportGridApi  = GlobalConstants.inDispGatewat + 'api/insertDynamicReportGrid/';
  public static updateDynamicReportFormApi  = GlobalConstants.inDispGatewat + 'api/updateDynamicReportForm/';
  public static updateDynamicReportGridApi  = GlobalConstants.inDispGatewat + 'api/updateDynamicReportGrid/';
  public static getDynamicReportResultApi  = GlobalConstants.inDispGatewat + 'api/getDynamicReportResult/';
  public static getDynamicReportData  = GlobalConstants.inDispGatewat + 'api/getDynamicReportData/';
  public static exportRules  = GlobalConstants.inDispGatewat + 'api/exportRules/';
  public static importDynamicRulesApi  = GlobalConstants.inDispGatewat + 'api/importDynamicRules/';
  public static insertLogsDataApi  = GlobalConstants.inDispGatewat + 'api/insertLogsData/';

  
  
  // ----------------------IN DISPLAY: SCREEN BUILDER------------------------------------------------------------------------\
  public static getDBRGrid = GlobalConstants.inDispGatewat + 'api/getDBRGrid/';
  public static getDBRGridByRuleActionAndColumnId = GlobalConstants.inDispGatewat + 'api/getDBRGridByRuleActionAndObjectId/';
  public static getDBRGridByRuleActionAndRuleIdApi = GlobalConstants.inDispGatewat + 'api/getDBRGridByRuleActionAndRuleId/';
  public static getDBRInfo = GlobalConstants.inDispGatewat + 'api/getDBRInfo/';
  public static saveDRBRule = GlobalConstants.inDispGatewat + 'api/saveDRBRule/';
  public static callApi = GlobalConstants.inDispGatewat + 'api';
  public static callProcedure = GlobalConstants.inDispGatewat + 'api/callProcedure';
  public static updateDRBRule = GlobalConstants.inDispGatewat + 'api/updateDRBRule/';
  public static deleteDRBRule = GlobalConstants.inDispGatewat + 'api/deleteDRBRule/';

  // ----------------------IN DISPLAY: SCREEN BUILDER------------------------------------------------------------------------\
  public static fetchGridsTableData = GlobalConstants.inDispGatewat + 'api/fetchGridsTableData/';
  public static fetchApplicationList = GlobalConstants.inDispGatewat + 'api/fetchApplicationList/';
  public static fetchParentMenuList = GlobalConstants.inDispGatewat + 'api/fetchParentMenuList/';
  public static dynamicDeleteFormBuilderApi = GlobalConstants.inDispGatewat + 'api/dynamicDeleteFormBuilder';
  public static getQbeIdApi = GlobalConstants.inDispGatewat + 'api/getQbeId/';
  public static GetColApi = GlobalConstants.inDispGatewat + 'api/GetCol/';
  public static addScreen = GlobalConstants.inDispGatewat + 'api/addScreen/';
  public static getAllScreens = GlobalConstants.inDispGatewat + 'api/getAllScreens/';
  public static deleteScreen = GlobalConstants.inDispGatewat + 'api/deleteScreen/';
  public static getScreenData = GlobalConstants.inDispGatewat + 'api/getScreenData/';
  public static updateScreen = GlobalConstants.inDispGatewat + 'api/updateScreen/';
  public static getScreenPreviewData = GlobalConstants.inDispGatewat + 'api/getScreenPreviewData/';
  public static getParamsNameApi = GlobalConstants.inDispGatewat + 'api/getParamsName/';
  public static getAllTablesCombo = GlobalConstants.inDispGatewat + 'api/getAllTablesCombo/';
  public static getOneTableCombo = GlobalConstants.inDispGatewat + 'api/getOneTables/';
  public static GetColVal = GlobalConstants.inDispGatewat + 'api/GetColVal/';
  public static getOrdersApi = GlobalConstants.inDispGatewat + 'api/getOrders/';
  public static GetColValLkpApi = GlobalConstants.inDispGatewat + 'api/GetColValLkp/';
  public static getRelationBetween2tables = GlobalConstants.inDispGatewat + 'api/getRelationBetween2tables/';

  //---------------------OBJECT BUILDER----------------------------------------

  public static getQueryNameApi = GlobalConstants.inDispGatewat +'api/getQueryName/';
  public static getChartDataApi = GlobalConstants.inDispGatewat +'api/getChartData/';
  public static getSelectChartApi = GlobalConstants.inDispGatewat +'api/selectChart/';
  public static deleteChartApi = GlobalConstants.inDispGatewat +'api/deleteChart/';
  public static addChartApi =  GlobalConstants.inDispGatewat +'api/addChart/';
  public static updateChartApi = GlobalConstants.inDispGatewat +'api/updateChart/';
  public static selectChartType = GlobalConstants.inDispGatewat +'api/selectChartType/'
  public static rowSourceApi = GlobalConstants.inDispGatewat +'api/decodeQuery/';
  public static getQueryData = GlobalConstants.inDispGatewat +'api/getQueryData/'
  public static getGridDataApi = GlobalConstants.inDispGatewat +'api/getGridData/';
  public static deleteGridApi = GlobalConstants.inDispGatewat +'api/deleteGrid/';
  public static addGridApi =  GlobalConstants.inDispGatewat +'api/addGrid/';
  public static selectGridApi =  GlobalConstants.inDispGatewat +'api/selectGrid/';
  public static updateGrid =  GlobalConstants.inDispGatewat +'api/updateGrid/';
  public static decodeGridQuery = GlobalConstants.inDispGatewat +'api/decodeGridQuery/';
  public static getGridQueryData = GlobalConstants.inDispGatewat +'api/getGridQueryData/';
  public static getKpiDataApi = GlobalConstants.inDispGatewat +'api/getKpiData/';
  public static deleteKpiApi = GlobalConstants.inDispGatewat +'api/deleteKpi/';
  public static addKpiApi =  GlobalConstants.inDispGatewat +'api/addKpi/';
  public static updateKpiApi =  GlobalConstants.inDispGatewat +'api/updateKpi/';
  public static selectKpiApi =  GlobalConstants.inDispGatewat +'api/selectKpi/';
  public static deleteFieldSetApi = GlobalConstants.inDispGatewat + 'api/deleteFieldSet/';
  public static getKpiQueryData = GlobalConstants.inDispGatewat +'api/getKpiQueryData/';
  public static decodeKpiQuery = GlobalConstants.inDispGatewat +'api/decodeKpiQuery/';
  public static getDashboardChartData = GlobalConstants.inDispGatewat +'api/getDashboardChartData';
  public static getDashboardGridData = GlobalConstants.inDispGatewat +'api/getDashboardGridData';
  public static getDashboardKpiData = GlobalConstants.inDispGatewat +'api/getDashboardKpiData';
  public static addDashboardChart = GlobalConstants.inDispGatewat +'api/addDashboardChart/';
  public static getDashboardTemplateData = GlobalConstants.inDispGatewat +'api/getDashboardTemplateData/';
  public static updateDashboardTempalte = GlobalConstants.inDispGatewat +'api/updateDashboardTempalte/';
  public static addDashboardTempalte = GlobalConstants.inDispGatewat +'api/addDashboardTempalte/';
  public static deleteDashboardTempalte = GlobalConstants.inDispGatewat +'api/deleteDashboardTempalte/';
  public static getDashboardTemplateName = GlobalConstants.inDispGatewat +'api/getDashboardTemplateName/';
  public static getDashboardTemplateTab = GlobalConstants.inDispGatewat +'api/getDashboardTemplateTab/';
  public static displayDashboard = GlobalConstants.inDispGatewat +'api/displayDashboard/';
  public static addDashboardKpi = GlobalConstants.inDispGatewat +'api/addDashboardKpi/';
  public static addDashboardGrid = GlobalConstants.inDispGatewat +'api/addDashboardGrid/';
  public static deleteSelectedObject =  GlobalConstants.inDispGatewat +'api/deleteSelectedObject/';
  public static selectGridRelatedToKpi =  GlobalConstants.inDispGatewat +'api/selectGridRelatedToKpi/';
  public static selectChartRelatedToKpi =  GlobalConstants.inDispGatewat +'api/selectChartRelatedToKpi/';
  public static getAllGridforDropdown =  GlobalConstants.inDispGatewat +'api/getAllGridforDropdown/';
  public static getAllChartforDropdown =  GlobalConstants.inDispGatewat +'api/getAllChartforDropdown/';
  public static getAllChartScreenBuilder =  GlobalConstants.inDispGatewat +'api/getAllChartScreenBuilder/';
  public static getAllGridScreenBuilder =  GlobalConstants.inDispGatewat +'api/getAllGridScreenBuilder/';
  public static getAllKpiScreenBuilder =  GlobalConstants.inDispGatewat +'api/getAllKpiScreenBuilder/';
  public static getAllRulesApi =  GlobalConstants.inDispGatewat +'api/getDBRCombo/';
  public static getColNameAndColId =  GlobalConstants.inDispGatewat +'api/getColNameAndColId/';
  public static callingApi = GlobalConstants.inDispGatewat + 'api';

  // Dynamic Search
  public static getDynamicSearch = GlobalConstants.inDispGatewat + 'api/getDynamicSearch/';
  public static getSearchType = GlobalConstants.inDispGatewat + 'api/getSearchType/';
  public static getWhereCondition = GlobalConstants.inDispGatewat + 'api/getWhereCondition/';
  public static getThirdDropDown = GlobalConstants.inDispGatewat + 'api/getThirdDropDown/';

  // public static getLibrary = GlobalConstants.inDispGatewat + 'api/getLibrary/';


  // USM Sanction

  public static getRoleSanctionList = GlobalConstants.usmGateway + 'api/usmrole/Sanction';
  public static getAllRoleSanctionList = GlobalConstants.usmGateway + 'api/usmrole/AllSanction';


  //AML
  public static insertQueryForm = GlobalConstants.inDispGatewat + 'api/insertQueryForm';
  public static getQueryForm = GlobalConstants.inDispGatewat + 'api/getQueryForm/';
  public static getQbeName = GlobalConstants.inDispGatewat + 'api/getQbeName/';
  public static checkIfConditionExists = GlobalConstants.inDispGatewat + 'api/checkIfConditionExists/';
  public static updateQueryForm = GlobalConstants.inDispGatewat + 'api/updateQueryForm';

//datacrowd
public static  ipAddressDataCrowd = "https://"+ GlobalConstants.endPointAddress +":8088";
public static ipAddress = "https://"+ GlobalConstants.endPointAddress +":8088";
public static  ipAddressKYG = "http://"+ GlobalConstants.endPointAddress +":8112/kwg";
public static  ip = "http://"+GlobalConstants.endPointAddress ;

}
