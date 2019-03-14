
/*

  The regular expressions below attempt to match citations to legal source materials, such as cases and statutes, 
  primarily in U.S. Federal and state jurisdictions.

  These were originally used as part of the Jureeka broswer extension, written by Michael Poulshock 
  (github.com/mpoulshock) and subsequently maintained by Cornell's Legal Information Institute (law.cornell.edu).

  The Jureeka browser extension was built upon the AutoLink script by Jesse Ruderman (www.squarefree.com).

  The code below is subject to the MIT software license.

*/


/***********************************
 *             Filters             *
 ***********************************/

const server_url = "<put citator URL here>"; 


const filters = [
  {
    name: "U.S. and State Constitutions",
    regexp: /(U\.? ?S\.?) Const\.?,? ?(((a|A)rt\.?|(a|A)mend\.?|(p|P)mbl\.?|(p|P)reamble)( ?[XVI]+))?((, (ȼs|S|&sect;|&#167) ([0-9]+)) ?(, cl\. ([0-9]+)\.?)?)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=Constitutions&juris=" + match[1] + "&part=" + match[3] + "&art=" + match[8] +  "&sec=" + match[12] + "&cl=" + match[14] ;}
  },
  {
    name: "U.S. Supreme Court",
    regexp: /([0-9]|[1-9][0-9]|[1-5][0-9][0-9]) (u\.? ?s\.?) ([0-9]+)(, ([0-9]+))?( \(([0-9]+)\))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=U.S.&vol=" + match[1] + "&page=" + match[3] + "&pinpoint=" + match[5] + "&year=" + match[7]; }
  },
  {
    name: "U.S. Code",
    regexp: /([0-9]+) U\.? ?S\.? ?C\.?( ?S\.?|A\.?)? (ȼs|&sect;|&#167|section|sect?\.?)? ?(\d{1,6}(?:[a-zA-Z]{0,4}(?:\-\d{0,3}[a-zA-Z]?)?)?) ?((?:\([0-9a-zA-Z]\))+)? ?(?:\((\d{4})\))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=U.S.C.&title=" + match[1] + "&sec=" + match[4] + "&sec2=" + match[5] + "&year=" + match[6] ; }
  },
  {
    name: "I.R.C. Internal Revenue Code",
    regexp: /I\.? ?R\.? ?C\.? (?:ȼs|&sect;|&#167|section|sect?\.?)? ?(\d{1,6}(?:[a-zA-Z]{0,4}(?:\-\d{0,3}[a-zA-Z]?)?)?) ?((?:\([0-9a-zA-Z]\))+)? ?(?:\((\d{4})\))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=U.S.C.&title=26&sec=" + match[1] + "&sec2=" + match[2] + "&year=" + match[3] ; }
  },
  {
    name: "U.S. Public Laws",
    regexp: /Pub(\.?|lic) ?L(\.?|aw) ?(No\.?)? ?(10[4-9]|11[0-9])-([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=USPubLaws&cong=" + match[4] + "&no=" + match[5]; }
  },
  {
    name: "U.S. Statutes at Large",
    regexp: /(1(?:17|18|19|20|21))\ Stat\.\ ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=USStatLarge&vol=" + match[1] + "&no=" + match[2]; }
  },
  {
    name: "Code of Federal Regulations Section",
    regexp: /([0-9]+) (C\.?F\.?R\.?) (ȼs)? ?([0-9a-zA-Z\-]+)\.([0-9a-zA-Z\-]+) ?((?:\([0-9a-zA-Z]\))+)? ?(?:\((\d{4})\))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=CFR&title=" + match[1] + "&part=" + match[4] + "&sec=" + match[5] + "&sec2=" + match[6] + "&year=" + match[7]; }
  },
  {
    name: "Code of Federal Regulations Part",
    //Still trimming this down from section template above
    regexp: /([0-9]+) (C\.?F\.?R\.?) (Parts?) ?([0-9a-zA-Z\-]+) ?((\([a-zA-Z0-9]\) ?(\([a-zA-Z0-9]\))?) ?((-[0-9](\([a-zA-Z0-9]\) ?(\([a-zA-Z0-9]\))?)) ?)?(\([IXVixv]+\))?)?((Subpart) ?[a-zA-Z])?(\((\d{4})\))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=CFR&title=" + match[1] + "&part=" + match[4] + "&sec=" + match[5] + "&year=" + match[16]; }
  },
  {
    name: "Treasury Regulations",
    regexp: /Treas\.? ?Reg\.? ?(ȼs|&sect;|&#167|section|sect?\.?|Parts?)* ?([0-9aA]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CFR&title=26&part=" + match[2]; }
  },
  {
    name: "Fed. R. Civ. P.",
    regexp: /(F\.?R\.?C\.?P\.?|Fed\.? ?R(\.?|ule) ?Civ\.? ?Pr?o?c?\.?|Federal Rules? of Civil Procedure) ?(Rule)? ?([0-9]+)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=FRCP&rule=" + match[4]; }
  },
  {
    name: "Federal Register",
    regexp: /((6|7)[0-9]) (F\.?R\.?|Fed\. ?Reg\.) ([0-9,]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=FedRegister&vol=" + match[1] + "&page=" + match[4]; }
  },
  {
    name: "Federal Reporter, Second Series",
    regexp: /(17[8-9]|1[8-9][0-9]|[2-9][0-9][0-9]) ?F\.? ?2d\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=F2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Federal Reporter, Third Series",
    regexp: /([1-9]|[1-9][0-9]|[1-9][0-9][0-9]) F\.? ?3d\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=F3d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Federal Reporter, First Series",
    regexp: /([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-7][0-9]|28[0-1]) F\.? ([0-9]+)(\.|;|,|-|\s)/ig,
    href: function(match) { return "http://" + server_url + "?doc=F1d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Federal Supplement",
    regexp: /([0-9]+ (F\.? ?Supp\.? ?2d\.?|F\.? ?Supp\.?) [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=FedSupp&cite=" + match[1]; }
  },
  {
    name: "Fed. R. Evid.",
    regexp: /(FRE | fre |Fed\.? ?R(\.?|ule) ?Evid\.?|Federal Rules? of Evidence)( ?[0-9]+)?/g,
    href: function(match) { return "http://" + server_url + "?doc=FRE&rule=" + match[3]; }
  },
  {
    name: "Fed. R. Crim. P.",
    regexp: /(FRCrP|Fed\.? ?R(\.?|ule) ?Crim\.? ?Pr?o?c?\.?|Federal Rules? of Criminal Procedure) (([0-9]+)\.?([0-9])?)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=FRCrimP&rule=" + match[4] + "&ruleDec=" + match[5]; }
  },
  {
    name: "Fed. R. App. P.",
    regexp: /(FRAP|Fed\.? ?R(\.?|ule) ?App\.? ?Pr?o?c?\.?|Federal Rules? of Appellate Procedure) ([0-9]+(\.1)?)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=FRAP&rule=" + match[3]; }
  },
  {
    name: "Uniform Commercial Code",
    regexp: /(UCC|U\.C\.C\.|Uniform Commercial Code) ?(ȼs|&sect;|&#167;|section|sect?\.?)* ?(([1-9A]+)-([0-9]+))/g,
    href: function(match) { return "http://" + server_url + "?doc=UCC&part=" + match[4] + "&prov=" + match[5]; }
  },
  {
    name: "Regional State Reporters",
    regexp: /([1-9]|[1-9][0-9]|[1-9][0-9][0-9]) ((So\.?|P\.?|S\.? ?W\.?|S\.? ?E\.?|N\.? ?W\.?|N\.? ?E\.?|A\.?)( ?(2|3)d\.?)?) ([0-9]+)(,|\.|;| )/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=RegionalRptrs&vol=" + match[1] + "&rptr=" + match[2] + "&page=" + match[6]; }
  },
  // following regional state reporter regex should not be reached due to MP regex above --------
  {
    name: "Regional State Reporters (U.S. - 3d ser.)",
    regexp: /([1-9][0-9]{0,2}) ((So\.?|P\.?|S\.?W\.?|S\.?E\.?|N\.?W\.?|N\.?E\.?|A\.?) ?3d\.?) ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&vol=" + match[1] + "&rptr=" + match[2] + "&page=" + match[4]; }
  },
  {
    name: "Regional State Reporters (U.S. - P)",
    regexp: /([1-9][0-9]{0,2}) P\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=p&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - P2d)",
    regexp: /([1-9][0-9]{0,2}) P\.? ?2d\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=p2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - SW)",
    regexp: /([1-9][0-9]{0,2}) S\.? ?W\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=sw&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - SW2d)",
    //regexp: /(9[3-9][0-9]) S\.?\ ?W\.?\ ?2d ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) S\.? ?W\.? ?2d ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=sw2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - NW)",
    // regexp: /(3[2-9]|[4-9][0-9]|1[0-8][0-9]) N\.? ?W\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) N\.? ?W\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=nw&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - NW2d)",
    //regexp: /(559|5[6-9][0-9]|[6-9][0-9][0-9]) N\.? ?W\.? ?2d ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) N\.?\ ?W\.?\ ?2d ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=nw2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - So.)",
    // regexp: /(3[8-9]|[4-8][0-9]|9[0-2]) So\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) So\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=so&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - So2d)",
    //regexp: /(6[8-9][0-9]|7[0-9][0-9]) So\.? ?2d\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) So\.? ?2d\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=p&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - SE)",
    //regexp: /(6[8-9][0-9]|7[0-9][0-9]) S\.? ?E\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) S\.? ?E\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=se&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - SE2d)",
    //regexp: /(48[1-9]|49[0-9]|[5-9][0-9][0-9]) S\.? ?E\.? ?2d ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) S\.? ?E\.? ?2d ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=se2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - NE)",
    //regexp: /(3[1-9]|[4-9][0-9]|1[0-2][0-9]|13[0-5]) N\.? ?E\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) N\.? ?E\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=ne&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - NE2d)",
    //regexp: /(67[5-9]|6[8-9][0-9]|[7-9][0-9][0-9]) N\.? ?E\.? ?2d ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) N\.? ?E\.? ?2d ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=ne2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - A)",
    //regexp: /(3[1-9]|[4-9][0-9]|10[0-9]|11[0-6]) A\.? ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) A\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=a&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Regional State Reporters (U.S. - A2d)",
    //regexp: /(68[6-9]|69[0-9]|[7-9][0-9][0-9]) A\.? ?2d ([0-9]+)/ig,
    regexp: /([1-9][0-9]{0,2}) A\.? ?2d ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RegionalRptrs&rptr=a2d&vol=" + match[1] + "&page=" + match[2]; }
  },
  // --------------------------------------------------------
  // --------------------------------------------------------
  {
    name: "Code of Alabama",
    regexp: /(Alabama|Ala\.?) ?Code (ȼs|&sect;|&#167|section|sect?\.?)* ?(([0-9A]+)-([0-9a-z]+)-([-0-9a-z]+))/ig,
    // href: function(match) { return "http://" + server_url + "?doc=AlabamaCode&cite=" + match[3] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=AlabamaCode&cite=" + match[3] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[6]; }
  },
  {
    name: "Alabama Appellate Courts",
    regexp: /[0-9]+ Ala\.?( ?Civ\.? ?App\.? ?)? [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "?doc=AlabamaCases"; }
  },
  {
    name: "Alaska Statutes",
    regexp: /Alaska Stat(\.?|utes?) (ȼs|&sect;|&#167|section|sect?\.?)* ?(([0-9]+).([0-9a-z]+).([-0-9a-z]+))/ig,
    // href: function(match) { return "http://" + server_url + "?doc=AlaskaStatutes&cite=" + match[3] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=AlaskaStatutes&cite=" + match[3] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[6]; }
  },
  {
    name: "Alaska Appellate Courts",
    regexp: /([0-9]+) P\.?(2|3)d ([0-9]+)(, ?[-0-9 n\.]+)? \(Alaska ((Ct\.)? ?App\.?)? ?[0-9]+\)/ig,
    href: function(match) { return "http://" + server_url + "?doc=AlaskaCases&vol=" + match[1] + "&reporter=" + match[2] + "&page=" + match[3]; }
  },
  {
    name: "Arizona Statutes",
    regexp: /Ariz(\.?|ona) (Rev\.?)? ?Stat(\.?|utes?)( Ann\.?)? (ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([-0-9A\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ArizonaStatutes&title=" + match[6] + "&sec=" + match[7]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ArizonaStatutes&title=" + match[6] + "&sec=" + match[7]; }
  },
  {
    name: "Arizona Cases",
    regexp: /[0-9]+ (Ariz\.? ?App\.?|Ariz\.?) [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ArizonaCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ArizonaCases&cite=" + match[0]; }
  },
  {
    name: "Arkansas Code",
    regexp: /Ark(\.?|ansas) Code( Ann\.?)? (ȼs|&sect;|&#167|section|sect?\.?)* ?(([0-9A]+)-([0-9a-z]+)-([-0-9a-z]+))/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ArkansasCode&cite=" + match[4] + "&title=" + match[5] + "&ch=" + match[6] + "&sec=" + match[7]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ArkansasCode&cite=" + match[4] + "&title=" + match[5] + "&ch=" + match[6] + "&sec=" + match[7]; }
  },
  {
    name: "Arkansas cases",
    regexp: /[0-9]+ (Ark\.? ?App\.?|Ark\.?) [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ArkansasCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ArkansasCases&cite=" + match[0]; }
  },
  {
    name: "California Code", // govt
    regexp: /Cal(\.?|ifornia) (agric\.?|bus\.? ?& ?prof\.?|bpc\.?|civ\.? ?proc\.?|ccp\.?|civil|civ\.?|com\.?|corp\.?|edu?c\.?|elec\.?|evid\.?|fam\.?|fin\.?|fish ?& ?game|fgc\.?|food ?& ?agric\.?|fac\.?|govt?\.?|harb\.? ?& ?nav\.?|hnc\.?|health ?& ?safety|hsc\.?|ins\.?|labor|lab\.?|mil\.? ?& ?vet\.?|mvc\.?|penal|pen\.?|prob\.?|pub\.? ?cont\.?|pcc\.?|pub\.? ?res\.?|prc\.?|pub\.? ?util\.?|rev\.? ?& ?tax\.?|rtc\.?|sts\.? ?& ?high\.?|shc\.?|unemp\.? ?ins\.?|uic\.?|veh\.?|water|wat\.?|welf\.? ?& ?inst\.?|wic\.?) Code( Ann\.?)? (ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.?]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=CalCode&vol=" + match[2] + "&sec=" + match[5]; }
  },
  {
    name: "California Cases",  // Omitted b/c not in Google Scholar: Cal., Cal.App.
    regexp: /([0-9]+ (Cal\.? ?4th|Cal\.? ?3d|Cal\.? ?2d|Cal\.? ?Rptr\.? ?3d|Cal\.? ?Rptr\.? ?2d|Cal\.? ?Rptr\.?|Cal\.? ?App\.? ?4th|Cal\.? ?App\.? ?3d|Cal\.? ?App\.? ?2d) [0-9]+)(,|\.|;| )/ig,
    // href: function(match) { return "http://" + server_url + "?doc=CAcases&cite=" + match[1]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=CAcases&cite=" + match[1]; }
  },
  {
    name: "Colorado Statutes",
    regexp: /Colo(\.?|rado) (Rev\.?)? ?Stat(\.?|utes?)( Ann\.?)? (ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9\.]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=ColoradoStatutes&prov=" + match[7]; }
  },
  {
    name: "Connecticut Statutes",
    regexp: /Conn(\.?|ecticut) ?Gen(\.?|eral) ?Stat(\.?|utes?)( Ann\.?)? (ȼs|sect?\.?|&sect;|&#167|section)* ?([0-9]+a?)-([0-9a-z]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ConnStatutes&title=" + match[6] + "&sec=" + match[7]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ConnStatutes&title=" + match[6] + "&sec=" + match[7]; }
  },
  {
    name: "Connecticut Cases",
    regexp: /[0-9]+ (Conn\.? ?App\.?|Conn\.?) [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=ConnCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ConnCases&cite=" + match[0]; }
  },
  {
    name: "Delaware Code",
    regexp: /Del(\.?|aware) ?Code ?( Ann\.?)?,? tit\.? ([0-9]+)(,? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9]+))?/ig,
    // href: function(match) { return "http://" + server_url + "?doc=DelawareCode&title=" + match[3] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=DelawareCode&title=" + match[3] + "&sec=" + match[6]; }
  },
  {
    name: "Delaware cases",
    regexp: /Del\.? (Ch\.?)? 2[0-9]+/g,
    href: function(match) { return "http://" + server_url + "?doc=DelawareCases"; }
  },
  {
    name: "D.C. Code",
    regexp: /(D\.?C\.?|District of Columbia) Code (Ann.?)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=DCCode"; }
  },
  {
    name: "D.C. Court of Appeals",
    regexp: /D\.? ?C\.? ?App\.? (1999|2[0-9]+)/g,
    href: function(match) { return "http://" + server_url + "?doc=DCCases"; }
  },
  {
    name: "Florida Statutes",
    regexp: /(F\.? ?S\.? ?A\.?|Fla\.? Stat\.?( Ann\.?)?) ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)\.([0-9]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=FloridaStatutes&ch=" + match[4] + "&sec=" + match[5]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=FloridaStatutes&ch=" + match[4] + "&sec=" + match[5]; }
  },
  {
    name: "Florida cases",
    regexp: /Fla\.? (Dist\.?)? ?(App\.?)? ?[1-5]? ?(Dist\.)? ?(199|200)[0-9]/ig,
    href: function(match) { return "http://" + server_url + "?doc=FloridaCases"; }
  },
  {
    name: "Georgia Code",
    regexp: /Ga\.? Code( Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([-0-9A\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=GeorgiaCode&title=" + match[3] + "&sec=" + match[4]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=GeorgiaCode&title=" + match[3] + "&sec=" + match[4]; }
  },
  {
    name: "Georgia Cases",
    regexp: /([0-9]+ Ga\.?( ?App\.?)? [0-9]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=GeorgiaCases&cite=" + match[1]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=GACases&cite=" + match[1]; }
  },
  {
    name: "Hawai'i Statutes",
    regexp: /Haw(\.?|ai'?i) Rev(\.?|ised) Stat(\.?|utes)?( Ann\.?)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=HawaiiStatutes"; }
  },
  {
    name: "Hawai'i Appellate Courts",
    regexp: /(8[7-9]|9[0-9]|1[0-9]+) Haw(\.?|ai'?i) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "?doc=HawaiiCases"; }
  },
  {
    name: "Idaho Code",
    regexp: /Idaho Code ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([0-9]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=IdahoCode&title=" + match[2] + "&sec=" + match[3]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IdahoCode&title=" + match[2] + "&sec=" + match[3]; }
  },
  {
    name: "Idaho Supreme Court",
    regexp: /[0-9]+ Idaho [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "?doc=IdahoCases"; }
  },
  {
    name: "Illinois Statutes",
    regexp: /([0-9]+) (ILCS|Ill\.? Comp\.? Stat\.?( Ann\.)?) ([0-9]+)\/([-0-9a-z&#;\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=IllinoisStatutes&ch=" + match[1] + "&s1=" + match[4] + "&s2=" + match[5]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IllinoisStatutes&ch=" + match[1] + "&s1=" + match[4] + "&s2=" + match[5]; }
  },
  {
    name: "Illinois Cases",  // Omitted b/c not in Google Scholar: Ill., Ill.App.
    regexp: /([0-9]+ (Ill\.? ?2d|Ill\.? ?Dec\.?|Ill\.? ?App\.? ?2d|Ill\.? ?App\.? ?3d|Ill\.? ?2d\.?) [0-9]+)(,|\.|;| )/ig,
    // href: function(match) { return "http://" + server_url + "?doc=IllinoisCases&cite=" + match[1]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IllinoisCases&cite=" + match[1]; }
  },
  {
    name: "Indiana Code",
    regexp: /(I\.?C\.?|Ind(\.?|iana) ?Code ?(Ann(\.?|otated))?) ?(ȼs|&sect;|&#167|section|sect?\.?)* ?(([0-9\.]+)-([0-9\.]+)-([0-9\.]+)-([0-9\.]+))/ig,
    // href: function(match) { return "http://" + server_url + "?doc=IndianaCode&cite=" + match[6] + "&title=" + match[7] + "&art=" + match[8] + "&sec=" + match[9]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IndianaCode&cite=" + match[6] + "&title=" + match[7] + "&art=" + match[8] + "&sec=" + match[9]; }
  },
  {
    name: "Indiana Cases",
    regexp: /[0-9]+ (Ind\.? ?App\.?|Ind\.?) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IndianaCases&cite=" + match[0]; }
  },
  {
    name: "Iowa Code",
    regexp: /Iowa ?Code ?(Ann(\.?|otated))? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+([A-Z])?)\.([0-9])/ig,
    // href: function(match) { return "http://" + server_url + "?doc=IowaCode&ch=" + match[4] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=IowaCode&ch=" + match[4] + "&sec=" + match[6]; }
  },
  {
    name: "Iowa Cases",
    regexp: /\(Iowa (App\.?)? ?(199(8|9)|200[0-9])\)/ig,
    href: function(match) { return "http://" + server_url + "?doc=IowaCases"; }
  },
  {
    name: "Kansas Statutes",
    regexp: /(K\.?S\.?A\.?|Kan(\.?|sas) ?Stat\.? ?( Ann\.?)?) ?(ȼs|&sect;|&#167|section|sect?\.?)? ?([0-9a]+)-([-0-9a-z,]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=KansasStatutes&ch=" + match[5] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=KansasStatutes&ch=" + match[5] + "&sec=" + match[6]; }
  },
  {
    name: "Kansas Cases",
    regexp: /[0-9]+ (Kan\.? ?App\.? ?2d\.?|Kan\.?) [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=KansasCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=KansasCases&cite=" + match[0]; }
  },
  {
    name: "Kentucky Statutes",
    regexp: /K(y\.|entucky) ?Rev(\.|ised) ?Stat(\.|utes) ?( Ann(\.|otated))? ?(ȼs|&sect;|&#167|sect?\.?)* ?([0-9]+)([A-Z])?\.(([0-9]+)-)?([0-9a]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=KentuckyStatutes&ch=" + match[7] + "&chltr=" + match[8] + "&subch=" + match[10] + "&sec=" + match[11]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=KentuckyStatutes&ch=" + match[7] + "&chltr=" + match[8] + "&subch=" + match[10] + "&sec=" + match[11]; }
  },
  {
    name: "Kentucky Cases",
    regexp: /Ky\.? (App\.?)? ?(199(6|7|8|9)|200[0-9])/ig,
    href: function(match) { return "http://" + server_url + "?doc=KentuckyCases"; }
  },
  {
    name: "Maine Statutes",
    regexp: /Me\.? ?Rev\.? ?Stat\.? ?(Ann\.?)?,? ?tit(\.?|le) ?([-0-9a-z]+),? (ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9a-z]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MaineStatutes&title=" + match[3] + "&sec=" + match[5]; }
  },
  {
    name: "Maine Supreme Court",
    regexp: /(199[7-9]|200[0-9]) ME ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MaineSupCt&year=" + match[1] + "&no=" + match[2]; }
  },
  {
    name: "Maryland Court of Appeals",
    regexp: /(33[7-9]|3[4-9][0-9]|4[0-9][0-9]) Md\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MDCourtApp&vol=" + match[1]; }
  },
  {
    name: "Maryland Court of Special Appeals",
    regexp: /(10[4-9]|1[1-9][0-9]) Md\.? ?App\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MDCourtSpApp&vol=" + match[1]; }
  },
  {
    name: "Maryland Cases",
    regexp: /[0-9]+ (M\.?D\.? ?App\.?|M\.?D\.?) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MDCases&cite=" + match[0]; }
  },
  {
    name: "Massachusetts General Laws",
    regexp: /Mass\.? ?Gen\.? ?Laws ?ch\.? ?([0-9A-Z]+),? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MassGenLaws&ch=" + match[1] + "&sec=" + match[3]; }
  },
  {
    name: "Massachusetts SJC Cases",
    regexp: /([2-4][0-9][0-9]) Mass\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MassSJCCases&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Massachusetts Ct. App. Cases",
    regexp: /([1-9]|[1-9][0-9]) Mass\.? App\.? Ct\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MassCtAppCases&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Michigan Compiled Laws",
    regexp: /Mich\.? ?Comp\.? ?Laws ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MichStatutes&sec=" + match[3]; }
  },
  {
    name: "Michigan Supreme Court",
    regexp: /(([0-9]+) Mich\.?( ?App\.?)? [0-9]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=MichSupremeCt&vol=" + match[2]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MichCases&cite=" + match[1]; }
  },
  {
    name: "Michigan Court of Appeals",
    regexp: /([0-9]+) Mich\.? ?(Ct\.?)? ?App\.? ?[0-9]+/ig,
    href: function(match) { return "http://" + server_url + "?doc=MichCtApp&vol=" + match[1]; }
  },
  {
    name: "Minnesota Statutes",
    regexp: /Minn\.? ?Stat\.? ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9][0-9A-Z\.]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=MinnStatutes&sec=" + match[3]; }
  },
  {
    name: "Minnesota Cases",
    regexp: /[0-9]+ (Minn\.?) [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=MinnCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MinnCases&cite=" + match[0]; }
  },
  {
    name: "Mississippi Code",
    regexp: /Miss\.? ?Code ?Ann\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([0-9]+)-([0-9]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=MississippiCode&title=" + match[2] + "&ch=" + match[3] + "&sec=" + match[4]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MississippiCode&title=" + match[2] + "&ch=" + match[3] + "&sec=" + match[4]; }
  },
  {
    name: "Mississippi Cases",
    regexp: /Miss\.? ?(Ct\.? ?App\.?)? ?(199[6-9]|200[0-9])/ig,
    href: function(match) { return "http://" + server_url + "?doc=MississippiCases"; }
  },
  {
    name: "Montana Code",
    regexp: /Mont\.? ?Code ?Ann\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([0-9]+)-([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MontanaCode&title=" + match[2] + "&ch=" + match[3] + "&sec=" + match[4]; }
  },
  {
    name: "Nebraska Statutes",
    regexp: /Neb(\.?|raska) ?Rev(\.?|ised) ?Stat(\.?|utes) ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)-([0-9\.]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NebraskaStatutes&title=" + match[6] + "&sec=" + match[7]; }
  },
  {
    name: "Nevada Statutes",
    regexp: /(N\.? ?R\.? ?S\.?|Nev\.? ?Rev\.? ?Stat\.? ?(Ann\.?)?) ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9A-Z]+)\.([0-9\.]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NevadaStatutes&title=" + match[4] + "&sec=" + match[5]; }
  },
  {
    name: "Nevada cases",
    regexp: /[0-9]+ Nev\.? [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NevadaCases&cite=" + match[0]; }
  },
  {
    name: "New Jersey Statutes",
    regexp: /(N\.?J\.?S\.?A\.?|N\.?J\.? Stat\.? Ann\.?) ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9a-b]+):([0-9a-b]+)-([0-9a-b\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=NJSA&title=" + match[3] + "&sec=" + match[4] + "&subsec=" + match[5]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NJSA&title=" + match[3] + "&sec=" + match[4] + "&subsec=" + match[5]; }
  },
  {
    name: "New Jersey Administrative Code",
    regexp: /(N\.?J\.?A\.?C\.?|N\.?J\.? Administrative Code)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NJAC"; }
  },
  {
    name: "New Jersey Appellate Cases",
    regexp: /[0-9]+ N\.? ?J\.?( ?Super\.?)? [0-9]+/ig,
    // href: function(match) { return "http://" + server_url + "?doc=NJAppCases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NJAppCases&cite=" + match[0]; }
  },
  {
    name: "New Mexico Statutes",
    regexp: /(N\.?M\.?S\.?A\.?|N\.?M\.? ?Stat\.? ?(Ann\.)?) ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9a-z]+)-([0-9a-z]+)-([0-9a-z]+)/ig,
    //href: function(match) { return "http://" + server_url + "?doc=NMStatutes&ch=" + match[4] + "&art=" + match[5] + "&sec=" + match[6]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NMStatutes&ch=" + match[4] + "&art=" + match[5] + "&sec=" + match[6]; }
  },
  {
    name: "New Mexico Cases",
    regexp: /(199[8-9]|200[0-9]) ?-?(NMCA|NMSC) ?-?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NMCases&year=" + match[1] + "&ct=" + match[2] + "&no=" + match[3]; }
  },
  {
    name: "New Mexico Reports",
    regexp: /([0-9]+ (N\.? ?M\.?) [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NMReports&cite=" + match[0]; }
  },
  {
    name: "N.Y. C.P.L.R.",
    regexp: /(New York|N\.?Y\.? ?)?(C\.?P\.?L\.?R\.?|Civil Practice Law and Rules)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=NYCPLR"; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NYCPLR"; }
  },
  {
    name: "New York Court of Appeals",
    regexp: /(79|[8-9][0-9]|[1-4][0-9][0-9]) N\.?Y\.?2d\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NYCtApp&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "New York Cases", // Omitted b/c not in Google Scholar: N.Y., N.Y.S., A.D.
    regexp: /([0-9]+ (N\.? ?Y\.? ?2d|N\.? ?Y\.? ?S\.? ?2d|A\.? ?D\.? ?(2|3)d) [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NYcases&cite=" + match[1]; }
  },
  {
    name: "North Carolina Statutes",
    regexp: /N\.? ?C\.? ?Gen\.? ?Stat\.?( ?Ann\.)? (ȼs|S|&sect;|&#167|section|sect?\.?)* ?([0-9a-z]+)-([0-9\.a-z]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NCstatutes&title=" + match[3] + "&ch=" + match[4]; }
  },
  {
    name: "North Carolina cases",
    regexp: /([0-9]+ (N\.? ?C\.? ?App\.?|N\.? ?C\.?) [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NCcases&cite=" + match[1]; }
  },
  {
    name: "North Dakota Code",
    regexp: /N\.?D\.? ?Cent\.? ?Code (ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.]+)-([0-9\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=NDCode&title=" + match[2] + "&ch=" + match[3]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=NDCode&title=" + match[2] + "&ch=" + match[3]; }
  },
  {
    name: "North Dakota Supreme Court",
    regexp: /(199[7-9]|200[0-9]) ?ND ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NDSupremeCases&year=" + match[1] + "&no=" + match[2]; }
  },
  {
    name: "North Dakota Ct. of Appeals",
    regexp: /(199[8-9]|200[0-9]) ?ND App\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NDAppealsCases"; }
  },
  {
    name: "North Dakota Cases",
    regexp: /([0-9]+) N\.?W\.?2d\.? ([0-9]+)(, [0-9]+)? ?\(N\.D\. ?(Ct. ?App.)? ?[0-9]+\)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NDNW2dCases&vol=" + match[1]; }
  },
  {
    name: "Ohio Code",
    regexp: /Ohio ?Rev\.? ?Code ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9\.A]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=OhioCode&sec=" + match[3]; }
  },
  {
    name: "Ohio Administrative Code",
    regexp: /Ohio ?Admin\.? ?Code ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9\.:]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=OhioAdminCode&sec=" + match[2]; }
  },
  {
    name: "Ohio Supreme Court",
    regexp: /(199[2-9]|20[0-9][0-9])-Ohio-([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=OhioSupCt&year=" + match[1] + "&no=" + match[2]; }
  },
  {
    name: "Ohio Cases",
    regexp: /([0-9]+ (Ohio ?St\.? ?3d|Ohio ?St\.? ?2d|Ohio ?St\.?|Ohio App\.? ?3d|Ohio App\.? ?2d|Ohio App\.?|Ohio) [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=OhioCases&cite=" + match[1]; }
  },
  {
    name: "Oklahoma Cases",
    regexp: /(19[0-9][0-9]|20[0-9][0-9]) OK [0-9]+/g,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=OKCases&cite=" + match[0]; }
  },
  {
    name: "Oregon Statutes",
    regexp: /Ore?(\.?|egon) ?Rev\.? ?Stat\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9a-d]+)(.([0-9a-d]+))?/ig,
    // href: function(match) { return "http://" + server_url + "?doc=OregonStatutes&ch=" + match[3] + "&sec=" + match[4]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=OregonStatutes&ch=" + match[3] + "&sec=" + match[4]; }
  },
  {
    name: "Oregon Cases",
    regexp: /[0-9]+ (Or\.? ?App\.?|Or\.?) [0-9]+/g,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=ORCases&cite=" + match[0]; }
  },
  {
    name: "Pennsylvania Statutes",
    regexp: /([0-9]+) Pa\.?( ?C(ons)?\.?)? ?S(tat)?\.?( ?Ann\.)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)([0-9]{2})(\.([0-9]+))?/ig,
    // href: function(match) { return "http://" + server_url + "?doc=PAStatutes&title=" + match[1] + "&ch=" + match[7] + "&sec=" + match[8] + "&subsec=" + match[10]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=PAStatutes&title=" + match[1] + "&ch=" + match[7] + "&sec=" + match[8] + "&subsec=" + match[10]; }
  },
  {
    name: "Pennsylvania Code of Regulations",
    regexp: /([0-9]+) Pa\.? ?Code ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)(\.([0-9]+))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=PACode&title=" + match[1] + "&ch=" + match[3] + "&sec=" + match[5]; }
  },
  {
    name: "Pennsylvania Supreme Court",
    regexp: /\(Pa\.? ?(199[7-9]|200[0-9])\)/ig,
    href: function(match) { return "http://" + server_url + "?doc=PASupremeCt"; }
  },
  {
    name: "Pennsylvania Cases",
    regexp: /(([1-9][0-9][0-9]|[1-9][0-9]|[1-9]) (Pa\.? ?(Super\.?|Superior)( ?Ct\.?)?|Pa\.? ?(Commw\.?|Commonwealth)( ?Ct\.?)?|Pa\.?) [0-9]+)/g,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=PACases&cite=" + match[1]; }
  },
  {
    name: "Laws of Puerto Rico",
    regexp: /P\.?R\.? ?Laws ?Ann\.?/ig,
    href: function(match) { return "http://" + server_url + "?doc=PRLaws"; }
  },
  {
    name: "General Laws of Rhode Island",
    regexp: /R\.?I\.? ?Gen\.? ?Laws ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.A]+)-([0-9\.]+)-([0-9\.]+)/ig,
    //href: function(match) { return "http://" + server_url + "?doc=RIGeneralLaws&title=" + match[2] + "&ch=" + match[3] + "&sec=" + match[4]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=RIGeneralLaws&title=" + match[2] + "&ch=" + match[3] + "&sec=" + match[4]; }
  },
  {
    name: "Code of Rhode Island Rules",
    regexp: /R\.?I\.? ?Code ?R\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.A]+)-([-0-9\.]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=RICode&title=" + match[2] + "&sec=" + match[3]; }
  },
  {
    name: "South Carolina Codes",
    regexp: /S\.? ?C\.? ?Code (Ann\.?)? ?(Regs\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.A]+)-([0-9\.]+)(-([0-9\.]+))?/ig,
    // href: function(match) { return "http://" + server_url + "?doc=SCCodes&type=" + match[2] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[7]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=SCCodes&type=" + match[2] + "&title=" + match[4] + "&ch=" + match[5] + "&sec=" + match[7]; }
  },
  {
    name: "South Carolina cases",
    regexp: /[0-9]+ (S\.? ?C\.?) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=SCCases&cite=" + match[0]; }
  },
  {
    name: "South Dakota Codified Laws",
    regexp: /S\.? ?D\.? ?Codified ?Laws ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9a-z\.]+)?/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=SDCodifiedLaws&cite=" + match[3]; }
  },
  {
    name: "Tennessee Code",
    regexp: /Tenn(\.?|essee) ?Code ?(Ann(\.?|otated))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=TNCode"; }
  },
  {
    name: "Utah Code",
    regexp: /Utah Code ?Ann\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)([a-z])?-([0-9]+)([a-z])?-([0-9]+)([a-z]+)?/ig,
    // href: function(match) { return "http://" + server_url + "?doc=UTCode&title=" + match[2] + "&titltr=" + match[3] +"&ch=" + match[4] + "&chltr=" + match[5] + "&sec=" + match[6] + "&secltr=" + match[7];}
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=UTCode&title=" + match[2] + "&titltr=" + match[3] +"&ch=" + match[4] + "&chltr=" + match[5] + "&sec=" + match[6] + "&secltr=" + match[7];}
  },
  {
    name: "Utah Cases",
    regexp: /(19|20)[0-9][0-9] UT [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=UtahCases&cite=" + match[0]; }
  },
  {
    name: "Vermont Statutes",
    regexp: /Vt\.? ?Stat\.? ?Ann\.?,? ?tit\.? ?([0-9A]+), ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9]+)([a-z]+)?/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=VTStatutes&title=" + match[1] + "&sec=" + match[3] + "&sec2=" + match[4]; }
  },
  {
    name: "Vermont Supreme Court",
    regexp: /(15[4-9]|16[0-9]|17[0-8]) Vt\. [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "?doc=VTSupremeCt&vol=" + match[1]; }
  },
  {
    name: "Vermont Code",
    regexp: /Vt\.? ?Stat\.? ?Ann\.? ?tit\.? ?([0-9A]+), ?(ȼs|S|&sect;|&#167|(s|S)ection)* ?([0-9]+)([a-z]+)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=VTCode&title=" + match[1] + "&sec=" + match[4] + "&sec2=" + match[5]; }
  },
  {
    name: "Virginia Code",
    regexp: /Va\.? ?Code ?Ann\.? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([-0-9A\.:]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=VACode&sec=" + match[2]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=VACode&sec=" + match[2]; }
  },
  {
    name: "Virginia Cases",
    regexp: /[0-9]+ Va\.? ?(App\.?)? ?[0-9]+/ig,
    //href: function(match) { return "http://" + server_url + "?doc=VACases&cite=" + match[0]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=VACases&cite=" + match[0]; }
  },
  {
    name: "Revised Code of Washington",
    regexp: /Wash\.? ?Rev\.? ?Code? ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9A-Z\.]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RevCodeWash&sec=" + match[3]; }
  },
  {
    name: "Washington Cases",
    regexp: /[0-9]+ (Wash\.? ?2d\.?|Wash\.? ?App\.?|Wash\.?) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=WACases&cite=" + match[0]; }
  },
  {
    name: "Wisconsin Statutes",
    regexp: /Wis\.? ?Stat\.? ?(Ann\.?)? ?(ȼs|&sect;|&#167|section|sect?\.?)* ?([0-9\.]+)/ig,
    // href: function(match) { return "http://" + server_url + "?doc=WIStatutes&&cite=" + match[3]; }
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=WisconsinStatutes&cite=" + match[3]; }
  },
  {
    name: "Wisconsin Cases",
    regexp: /([0-9]+ (Wis\.? ?2d\.?|Wis\.?) [0-9]+)(,|\.|;| )/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=WICases&cite=" + match[1]; }
  },
  {
    name: "Wisconsin Cases (public domain citation)",
    regexp: /([0-9]+ Wi\.?( ?App\.?)? [0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=WICases&cite=" + match[0]; }
  },
  {
    name: "Miscellaneous Cases",
    regexp: /[0-9]+ (Haw\.? ?App\.?|Haw\.?|Hawaii|Idaho|Mont\.?|Neb\.? ?App\.?|Neb\.?|N\.? ?H\.?|W\.? ?Va\.?|B\.? ?R\.?) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=MiscCases&cite=" + match[0] + "&jur=" + match[1]; }
  },
  {
    name: "Public Domain Citations",	// Misc. small states
    regexp: /(19|20)[0-9][0-9] (ME|MT|ND|SD|VT|WY) [0-9]+/ig,
    href: function(match) { return "http://" + server_url + "/US.aspx?doc=PubDomCites&cite=" + match[0] + "&jur=" + match[2]; }
  },
  {
    name: "Congressional Resolutions",
    regexp: /(S\.? ?((Con\.?|J\.?)? ?Res\.?)?|H\.? ?R\.? ?((Con\.?|J\.?)? ?Res\.?)?) ?([0-9]+),? ?(10[3-9]|11[0-9])(th|rd) Cong\./ig,
    href: function(match) { return "http://" + server_url + "?doc=CongRes&type=" + match[1] + "&no=" + match[6] + "&cong=" + match[7]; }
  },
//  {
//    name: "Congressional Reports",
//    regexp: /(H\.? ?(R\.)?|S\.?) ?Rep\.? ?Nos?\.? (109|110)-([0-9]+)/ig,
//    href: function(match) { return "http://" + server_url + "?doc=CongReps&type=" + match[1] + "&cong=" + match[3] + "&no=" + match[4]; }
//  },
  {
    name: "NLRB Cases",
    regexp: /([0-9]+) N\.?L\.?R\.?B\.? ?(No\.?)? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NLRB&vol=" + match[1] + "&page=" + match[3]; }
  },
  {
    name: "BIA Cases",
    regexp: /([0-9]+) I\.? ?& ?N\.? ?Dec\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=BIA&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "Decisions of the Comptroller General",
    regexp: /([0-9]+) comp\.? ?gen\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=GOA&vol=" + match[1] + "&page=" + match[2]; }
  },
  {
    name: "U.S. Patents",
    regexp: /U\.? ?S\.? ?Pat(\.?|ent) ?Nos?\.? ([0-9,]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=USPatents&no=" + match[2]; }
  },

			// INTERNATIONAL LAW
  {
    name: "International Court of Justice",
    regexp: /I\.?C\.?J\.? Reports ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=ICJ&year=" + match[1]; }
  },
  {
    name: "International Court of Justice",
    regexp: /\[?\(?([0-9]+)\)?\]? I\.?C\.?J\.?/ig,
    href: function(match) { return "http://" + server_url + "?doc=ICJ&year=" + match[1]; }
  },
  {
    name: "Permanent Court of International Justice",
    regexp: /P\.?C\.?I\.?J\.?,? ?\(?(S|s)er(\.?|ies) ([ABC\/])\)?,? ?No\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=PCIJ&ser=" + match[3] + "&no=" + match[4]; }
  },
  {
    name: "European Court Reports",
    regexp: /\[?\(?(1969|19[7-9][0-9]|200[0-9])\)?\]? E\.?C\.?R\.? (([I]+)-)?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=ECR&year=" + match[1] + "&page=" + match[4] + "&part=" + match[3]; }
  },
  {
    name: "European Court of Human RIghts",
    regexp: /(E\.?Ct\.?H\.?R\.?|Eur\.? ?Ct\.? ?H\.?R\.?)/ig,
    href: function(match) { return "http://" + server_url + "?doc=ECtHR"; }
  },
  {
    //European citation form
    name: "Official Journal of the European Union",
    regexp: /O\.?J\.? ?(No\.? ?)?(L|C)?\.? ?([0-9]+),? ?[0-9]+\. ?[0-9]+\. ?([0-9]+)((,|\/)? ?(p\.)? ?([0-9]+))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=OJEU&ser=" + match[2] + "&issue=" + match[3] + "&year=" + match[4] + "&page=" + match[8]; }
  },
  {
    //U.S. citation form
    name: "Official Journal of the European Union",
    regexp: /\[?\(?(19[0-9][0-9]|20[0-9][0-9])\)?\]? O\.?J\.? \(?(L|C)?\.? ?([0-9]+)\)?((,|\/)? ?(p\.?)? ?([0-9]+))?/ig,
    href: function(match) { return "http://" + server_url + "?doc=OJEU&year=" + match[1] + "&ser=" + match[2] + "&issue=" + match[3] + "&page=" + match[7]; }
  },
  {
    name: "Inter-American Court of Human Rights",
    regexp: /Inter-Am(\.|erican) ?Ct?\.? ?H\.?R\.?,? ?\(?(S|s)er(\.?|ies) ([AC])\)?,? ?No\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=IACtHR&ser=" + match[4] + "&no=" + match[5]; }
  },
  {
    name: "United Nations Documents",
    regexp: /U\.?N\.? Doc\.?( No\.?)? ([A-Z0-9ubdmenorvay\/\.]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=UNDoc&docsymbol=" + match[2]; }
  },
  {
    name: "UN Committee Against Torture",
    regexp: /(CAT\/[A-Z0-9ubdmenorvay\/\.]+)/g,
    href: function(match) { return "http://" + server_url + "?doc=UNDoc&docsymbol=" + match[1]; }
  },
  {
    name: "World Trade Organization documents",
    regexp: /(WT\/[A-Za-z0-9\/\.]+)/g,
    href: function(match) { return "http://" + server_url + "?doc=WTODoc&docsymbol=" + match[1]; }
  },
  {
    name: "International Labor Organization Conventions",
    regexp: /I\.?L\.?O\.? Conv(\.?|ention) ?\(?(No\.? )? ?([0-9]+)\)?/ig,
    href: function(match) { return "http://" + server_url + "?doc=ILO&conv=" + match[3]; }
  },
  {
    name: "UN Reports of International Arbitral Awards (RIAA)",
    regexp: /([0-9]+) R\.?I\.?A\.?A\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=RIAA&vol=" + match[1] + "&page=" + match[2]; }
  },

			//CANADA

  {
    name: "Canada - Federal Courts",
    regexp: /([\[0-9+\] [0-9]+) (S\.?C\.?R\.?|F\.?C\.?) ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CanadaFedCases&vol=" + match[1] + "&rptr=" + match[2] + "&page=" + match[3]; }
  },
  {
    name: "Supreme Court of Canada",
    regexp: /([0-9]+) (S\.?C\.?C\.?) ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CanadaFedCases&vol=" + match[1] + "&rptr=" + match[2] + "&page=" + match[3]; }
  },
  {
    name: "Constitution Act (Canada)",
    regexp: /Constitution Act, (1867|1982)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CanadaConst&year=" + match[1]; }
  },
  {
    name: "Consolidated Statutes of Canada",
    regexp: /(((R\.?)?S\.?C\.?|C\.?R\.?C\.?) [0-9]+, c\. [-0-9A-Z]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CanadaStatutes&cite=" + match[1]; }
  },
  {
    name: "Consolidated Regulations of Canada",
    regexp: /((S\.?I\.?|S\.?O\.?R\.?)\/[-0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=CanadaRegs&cite=" + match[1]; }
  },


			// UNITED KINGDOM
  {
    name: "UK Appeals Cases",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?A\.?C\.? ([0-9]+)/g,
    href: function(match) { return "http://" + server_url + "?doc=UKAppealsCases&cite=" + match[0]; }
  },
  {
    name: "UK House of Lords",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?U\.?K\.?H\.?L\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=UKHL&cite=" + match[0]; }
  },
  {
    name: "UK Privy Council",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?U\.?K\.?P\.?C\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=UKPC&cite=" + match[0]; }
  },
  {
    name: "UK Queen's Bench",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?Q\.?B\.? ([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=UKQB&cite=" + match[0]; }
  },
  {
    name: "England and Wales Court of Appeal",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?E\.?W\.?C\.?A\.? (Civ\.?|Crim\.?|Admin\.?)? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=EWCA&cite=" + match[0]; }
  },
  {
    name: "England and Wales High Court",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?E\.?W\.?H\.?C\.? (Civ\.?|Crim\.?|Admin\.?|Ch\.?)? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=EWCA&cite=" + match[0]; }
  },
  {
    name: "UK Weekly Law Reports",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ? ?([0-9]+)? ?W\.?L\.?R\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=WLR&cite=" + match[0]; }
  },
  {
    name: "UK All England Reports",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ([0-9]+)? ?All E\.?R\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=AllER&cite=" + match[0]; }
  },
  {
    name: "Supreme Court of Ireland",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ? ?([0-9]+)? ?I\.?E\.?S\.?C\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=IESC&cite=" + match[0]; }
  },
  {
    name: "Court of Appeal in Northern Ireland",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ? ?([0-9]+)? ?N\.?I\.?C\.?A\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=NICA&cite=" + match[0]; }
  },

			// AUSTRALIA

  {
    name: "Australia Commonwealth Law Reports",
    regexp: /\[?\(?(19[0-9][0-9]|200[0-9])\)?\]? ? ?([0-9]+)? ?C\.?L\.?R\.? ?([0-9]+)/ig,
    href: function(match) { return "http://" + server_url + "?doc=AustraliaCLR&cite=" + match[0]; }
  }

];
