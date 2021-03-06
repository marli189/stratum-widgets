Ext.util.CSS.removeStyleSheet('shpr-companymodule');
    Ext.util.CSS.createStyleSheet(''
      
      + '.scw-header {'
      + '  width: 100%;'
      + '  padding: 0 0 0 2px;'
      + '  font-weight: normal;'
      + '  margin: 0 0 18px 0;'
     // + '  display: inline-block'
      + '}'
    //
     /* + '.scw-label {'
      + '  width: 25%;'
      + '  padding-left: 2px;'
     // + '  display: inline-block;'
      + '}'*/
    
      + '.scw-select {'
      + '  height: 42px;'
      + '  border-radius: 3px;'
      + '  background-color: #f9f9f9;'
      + '  border: solid 1px #b7b7b7;'
      + '  width: 25%;'
      + '  padding-right: 5px;'
      + '  float: left;'
      + '  border: none;'    
      + '}'
    
      + '.scw-select div {'
      + '  border-radius: 3px;'
      + '}'
    
      + '.scw-select-last {'
      + '  padding-right: 0px;'
      + '}'
    
      + '.scw-download-button {'
      //  + '  visibility: hidden;'
      + '}'
    
      + '.scw-download-button span {'
      + '  font-family: FontAwesome, open_sans;'
      + '  font-weight: normal;'
      + '  font-size: 13px;'
      + '}'
    
      + '.scw-grid .x-grid-row-summary .x-grid-cell:nth-child(3), .scw-grid .x-grid-row-summary .x-grid-cell:nth-child(4), .scw-grid .x-grid-row-summary .x-grid-cell:nth-child(5) {'
      + '  border-top: 1px black solid;'
      + '}'
    
      + '.scw-missing-data-panel {'
      + '  margin: 30px auto;'
      + '  width: 210px;'
      + '}'
    
      + '.scw-spinner {'
      + '  display: initial;'
      + '}'
    
      + '.scw-spinner.inactive {'
      + '  display: none;'
      + '}'
    
      + '.scw-qtip {'
      + '  width: 16px;'
      + '  height: 16px;'
      + '  display: inline-block;'
      + '  margin-bottom: 10px;'
      + '}'
    
      + '.scw-info {'
      + '  position: relative;'
      + '  display: inline-block;'
      + '  margin-right: 20px;'
      + '}'
    
      + '.scw-info div {'
      + '  height: 12px;'
      + '  width: 12px;'
      + '  border-radius: 12px;'
      + '  border: 1px solid #3e9bbc;'
      + '  text-align: center;'
      + '  color: white;'
      + '  font-family: robotoslab;'
      + '  font-size: 10px;'
      + '  font-weight: 500;'
      + '  font-style: italic;'
      + '  background: #3e9bbc;'
      + '  display: inline-block;'
      + '  line-height: 10px;'
      + '  letter-spacing: 1.5px;'
      + '  position: absolute;'
      + '  top: -18px;'
      + '  left: 1px;'
      + '}', 'shpr-companymodule');
    
      var CEMENT=1
      var NON_CEMENT=2;
      var TOTAL=1;
      var HALF=2;
       var capDefaults=[{	               
                       ArticleCaput: 'Alla',  
                       FemCaput: 'Alla'
               }];
         var stemDefaults=[{	               
                       P_FemStem: 'Alla',  
                       article_stem: 'Alla'
               }];
    var cupDefaults=[{	               
                       P_AcetCup: 'Alla',  
                       article_cup: 'Alla'
               }];
     var capSdefaults=[{	               
                       CaputSize: 'Alla',  
                       P_FemCaput: 'Alla'
               }];
    var linerDefaults=[
                 {
                     article_liner: 'Ingen',
                     P_AcetLiner: 'Ingen'
                 },
                 {
                     article_liner: 'Alla',
                     P_AcetLiner: 'Alla'
                 }
                 ];

    // // 
    function removeAllaItem(arr, valueCodeField){               
        var allaIndex=-1;
        for (var i=0; i<arr.length; i++){
            if(arr[i].getData()[valueCodeField]=='Alla')
                allaIndex=i;
                
        }        
        if(allaIndex>=0)
            arr.splice(allaIndex,1);
        return arr;
    }
    function setLinerValue(linerCmp, cupCmp){
        if(cupCmp.getValue()==NON_CEMENT || cupCmp.getValue()=='Alla')
            linerCmp.setValue('Alla');
        else
            linerCmp.setValue('Ingen');
    }
    Ext.apply(Ext.QuickTips.getQuickTip(), {
        dismissDelay: 0
    });
    var data1=null;
    var data2=null;
    var data3=null;
    var selections=null;
    var helpText='För att välja flera komponenter samtidigt, håll inne Ctrl-knappen när du gör dina val.<br/><br/>För att ta bort ett val från flera gjorda val, håll inne Ctrl-knappen och klicka på kryssrutan. Om Ctrl-knappen inte hålls inne kommer alla val förutom kryssrutevalet tas bort.';
    Ext.define('shpr.controller.MainController', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.main',
        id: 'mymaincontroller',	
       update: function (triggerCmp,b,c,d) {
            function removeHelpText(label){
                var i=label.indexOf('<div');
                if(i>=0)
                    return label.substring(0, label.indexOf('<div'));
                return label;
            }
            function invalidCombination (value){
                if(value.length>1 && (value.indexOf('Alla')>=0 || value.indexOf('Ingen')>=0 ))
                    return true;
                return false;
            }	
            function isValidAccordingToFollowup(view){		
                var startDate = view.down('#startDate').getValue();
                var followUpYears = view.down('#fuDropdown').getValue();
                var todaysDate=new Date();
                return Ext.Date.diff(startDate, todaysDate, Ext.Date.DAY) >= followUpYears*365;			
            }
            function disableCmps(view){
                view.down('#stemArticleDropdown').setDisabled(true);
                view.down('#cupArticleDropdown').setDisabled(true);
                view.down('#caputArticleDropdown').setDisabled(true);
                view.down('#capSizeDropdown').setDisabled(true);
                view.down('#linerArticleDropdown').setDisabled(true);
                view.down('#availableRows').setHtml('' );
                view.down('#exportTable').setDisabled(true);		
            }
            function clearValues(view){									                
                view.down('#stemArticleDropdown').getStore().loadData(stemDefaults);
                view.down('#cupArticleDropdown').getStore().loadData(cupDefaults);
                view.down('#capSizeDropdown').getStore().loadData(capSdefaults);		
                view.down('#caputArticleDropdown').getStore().loadData(capDefaults);			
                view.down('#linerArticleDropdown').getStore().loadData(linerDefaults);
                view.down('#availableRows').setHtml('Antal artiklar: <b>0</b>' );
    
                view.down('#stemArticleDropdown').setValue('Alla');
                view.down('#cupArticleDropdown').setValue('Alla')
                view.down('#caputArticleDropdown').setValue('Alla');
                view.down('#capSizeDropdown').setValue('Alla');
                setLinerValue(view.down('#linerArticleDropdown'),view.down('#fixationCupDropdown')) ;		
    
                view.down('#stemArticleDropdown').setDisabled(true);
                view.down('#cupArticleDropdown').setDisabled(true);
                view.down('#caputArticleDropdown').setDisabled(true);
                view.down('#capSizeDropdown').setDisabled(true);
                view.down('#linerArticleDropdown').setDisabled(true);			
            }                            
            var isProstBaseDataChange=triggerCmp!==undefined && ['fixationCupDropdown' , 'fixationStemDropdown' , 'cupRadio' , 'stemRadio' , 'protesisDropdown' ].indexOf(triggerCmp.itemId)>=0;          
            var isTimeDataChange=triggerCmp!==undefined && ['endDate' , 'startDate', 'fuDropdown'].indexOf(triggerCmp.itemId)>=0;          
            var view = this.getView();		            
            if(!isValidAccordingToFollowup(view)){
                    Ext.Msg.alert('Fr.o.m.-datum', 'Fr.o.m.-datum är för sent med hänseende till vald uppföljningstid', Ext.emptyFn);
                    return;
            }
            if(isProstBaseDataChange){
                clearValues(view);
            }           
            data1=data2=data3=selections=null;				        	
            var protesisType = view.down('#protesisDropdown').getValue(); //1=hel 2=halv
            if(!protesisType)
                return;                  
            var stemFix = view.down('#fixationStemDropdown').getValue();
            var cupFix = view.down('#fixationCupDropdown').getValue();
            var fu=view.down('#fuDropdown').getValue();
            var stemArt = view.down('#stemArticleDropdown').getValue();
            var cupArt = view.down('#cupArticleDropdown').getValue();
            var startDate = view.down('#startDate').getValue().toLocaleDateString();
            var endDate = view.down('#endDate').getValue().toLocaleDateString();		
            var capSize=view.down('#capSizeDropdown').getValue();															
            var cap=view.down('#caputArticleDropdown').getValue();									
            var liner=view.down('#linerArticleDropdown').getValue();		         
            var stemIsMain=view.down('#stemRadio').getValue();
            /* IE hack */
            startDate = startDate.replace(/[^ -~]/g, '');
            endDate = endDate.replace(/[^ -~]/g, '');
            var urlConfig='';		
            urlConfig+='start_datum=' + startDate + '&slut_datum=' + endDate + '&protestyp=' + protesisType + '&fu=' + fu;       					
            if(stemIsMain){            
                urlConfig+='&implantat=stam';            
                urlConfig+='&implant1_fixation=' + stemFix ;
                urlConfig+='&implant1=' + stemArt ;			
            }
            else{            			
                urlConfig+='&implantat=cup';            
                urlConfig+='&implant1_fixation=' + cupFix ;
                urlConfig+='&implant1=' + cupArt ;			
            }        
            if(!stemIsMain && stemFix){            
                urlConfig+='&implant2_fixation=' + stemFix ;
                urlConfig+='&implant2=' + stemArt;
            }
            else if (stemIsMain && cupFix){            
                urlConfig+='&implant2_fixation=' + cupFix ;
                urlConfig+='&implant2=' + cupArt; 
            }
            urlConfig+='&caput_strl=' + capSize;		
            urlConfig+='&caput=' + cap;							
            urlConfig+= '&liner=' + liner;	                    
            if(protesisType==HALF){			
                view.down('#stemRadio').setValue(true);
                view.down('#cupRadio').setValue(false);
                view.down('#linerArticleDropdown').setValue('Ingen');
                view.down('#linerArticleDropdown').setDisabled(true);
                view.down('#cupArticleDropdown').setDisabled(true);
                view.down('#fixationCupDropdown').setDisabled(true);
                view.down('#cupRadio').setDisabled(true);			                		
                view.down('#cupArticleDropdown').clearValue();
                view.down('#fixationCupDropdown').clearValue();   
                if(!stemFix)
                    return;
            }
            else if(protesisType==TOTAL){	
                view.down('#fixationCupDropdown').setDisabled(false);                
                view.down('#cupRadio').setDisabled(false);			
                if(!cupFix || !stemFix)
                    return;										                
            }		
            var error=false;
            if(cupFix==CEMENT)
                view.down('#linerArticleDropdown').setDisabled(true);				
            if(stemArt.length==0){
                Ext.Msg.alert('Artikel stam', 'Obligatoriskt fält. Värde saknas.', Ext.emptyFn);
                error=true;
            }		
            if(protesisType==1 && cupArt.length==0 ){
                Ext.Msg.alert('Artikel Cup', 'Obligatoriskt fält. Värde saknas.', Ext.emptyFn);
                error=true;
            }		
            if(capSize.length==0 ){
                Ext.Msg.alert('Caputstorlek', 'Obligatoriskt fält. Värde saknas.', Ext.emptyFn);
                error=true;
            }
            if(cap.length==0){
                Ext.Msg.alert('Caput', 'Obligatoriskt fält. Värde saknas.', Ext.emptyFn);
                error=true;
            }
            if(liner.length==0){
                Ext.Msg.alert('Liner', 'Obligatoriskt fält. Värde saknas.', Ext.emptyFn);
                error=true;
            }
            if(invalidCombination(stemArt)){
                Ext.Msg.alert('Stam', 'Man kan inte både välja "Alla" samt ytterligare ett val', Ext.emptyFn);
                error=true;
            }
            if(invalidCombination(cupArt)){
                Ext.Msg.alert('Cup', 'Man kan inte både välja "Alla" samt ytterligare ett val', Ext.emptyFn);
                error=true;
            }
            if(invalidCombination(capSize)){
                Ext.Msg.alert('Caputstorlek', 'Man kan inte både välja "Alla" samt ytterligare ett val', Ext.emptyFn);
                error=true;
            }
            if(invalidCombination(cap)){
                Ext.Msg.alert('Caput', 'Man kan inte både välja "Alla" samt ytterligare ett val', Ext.emptyFn);
                error=true;
            }
            if(invalidCombination(liner)){
                Ext.Msg.alert('Liner', 'Ogiltig kombination av val. Antingen Alla, Ingen eller ett/flera artikelnr', Ext.emptyFn);
                error=true;
            }
            if (error){		               
                return;
            }
            var spinner = view.down('#spinnerPanel');          
            spinner && spinner.show();		  		
            urlConfig=urlConfig.replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Alla', 'alla').replace('Ingen', 'ingen');
            Ext.Ajax.request({
                type: 'ajax',
                method: 'get',
                cors: true,
               url: '/stratum/api/statistics/shpr/supplier-mod_odep?' + urlConfig, 
               failure: function(response){
                    spinner && spinner.hide();                    
                    Ext.Msg.alert('Okänt fel', 'Okänt fel:' + response.statusText, Ext.emptyFn);
               } ,
               success: function (response) {
                    var result = Ext.decode(response.responseText).data;
                    spinner && spinner.hide();				
                    if (result.length !== 0) { 
                        selections = 'Selections' + '\n';
                        selections+=removeHelpText(view.down('#startDate').fieldLabel) + ';'  + view.down('#startDate').getValue().toLocaleDateString()+ '\n';   ;
                        selections+=removeHelpText(view.down('#endDate') .fieldLabel) + ';'  +view.down('#endDate').getValue().toLocaleDateString()+ '\n';   		
                        selections+= removeHelpText(view.down('#protesisDropdown').fieldLabel) + ';'  + view.down('#protesisDropdown').getDisplayValue() + '\n';       
                        selections+= removeHelpText(view.down('#fuDropdown').fieldLabel) + ';'  + view.down('#fuDropdown').getDisplayValue() + '\n';       
                        selections+= removeHelpText(view.down('#fixationStemDropdown').fieldLabel) + ';'  + view.down('#fixationStemDropdown').getDisplayValue()+ '\n';   
                        selections+=removeHelpText(view.down('#fixationCupDropdown').fieldLabel) + ';'  + view.down('#fixationCupDropdown').getDisplayValue()+ '\n';   
                        selections+=removeHelpText(view.down('#stemArticleDropdown').fieldLabel) + ';'  + view.down('#stemArticleDropdown').getDisplayValue()+ '\n';   
                        selections+=removeHelpText(view.down('#cupArticleDropdown').fieldLabel) + ';'  + view.down('#cupArticleDropdown').getDisplayValue()+ '\n';          
                        selections+=removeHelpText(view.down('#capSizeDropdown') .fieldLabel )+ ';'  +view.down('#capSizeDropdown').getDisplayValue()+ '\n';   															
                        selections+=removeHelpText(view.down('#caputArticleDropdown').fieldLabel) + ';'  + view.down('#caputArticleDropdown').getDisplayValue()+ '\n';   									
                        selections+=removeHelpText(view.down('#linerArticleDropdown').fieldLabel) + ';'  + view.down('#linerArticleDropdown').getDisplayValue()+ '\n';   				
                        view.down('#exportTable').setDisabled(false);				
                        var stems = result[0][0];                        
                        var cups = result[1][0];
                        if(!stemIsMain){
                            stems=result[1][0];
                            cups=result[0][0];
                        }
                        var capsS=result[2][0]
                        var caps = result[3][0];
                        var liners =result[4][0];
                        data1 =result[5];
                        data2 =result[6];
                        data3 =result[7][0];  
                        if(data2.NumberOfHipsRemaining==undefined){
                            view.down('#availableRows').setHtml('<b>För lite data vid uppföljngstiden</b>' );
                            return;
                        }
                        view.down('#exportTable').setDisabled(false);
                        var availRowsHtml='Antal patienter: <b>' + data2.TotalNumberOfPatients + '</b><br/>Antal höfter<br/>kvar vid<br/>uppföljnings-<br/>tidens slut: <b>' + data2.NumberOfHipsRemaining + '<br/></b>Antal artiklar: <b>' + data3.length +'</b>';                        
                        view.down('#availableRows').setHtml(availRowsHtml);
                        if (stems.length > 0) {                    						
                            view.down('#stemArticleDropdown').setDisabled(stems.length<2);
                            var stemChoices = view.down('#stemArticleDropdown');					
                            if(isProstBaseDataChange || isTimeDataChange)
                                stemChoices.getStore().loadData(stems);					
                        }
                        if (cups.length > 0) {                        
                            var cupChoices = view.down('#cupArticleDropdown');						                        
                            view.down('#cupArticleDropdown').setDisabled(cups.length<2);
                            if(isProstBaseDataChange || isTimeDataChange)
                                cupChoices.getStore().loadData(cups);						
                        }
                        if (capsS.length > 0) {                        
                            capsS[0].P_FemCaput="Alla";						
                            view.down('#capSizeDropdown').setDisabled(capsS.length<2);
                            var capsSChoices = view.down('#capSizeDropdown');						
                            if(isProstBaseDataChange || isTimeDataChange)
                                capsSChoices.getStore().loadData(capsS);						
                        }
                        if (caps.length > 0) {						
                            view.down('#caputArticleDropdown').setDisabled(false);
                            var capChoices = view.down('#caputArticleDropdown');						
                            if(isProstBaseDataChange || triggerCmp.itemId=='capSizeDropdown' || isTimeDataChange)
                                capChoices.getStore().loadData(caps);						
                        }
                        if (liners.length > 0) {                        
                            view.down('#linerArticleDropdown').setDisabled(liners.length<3 || cupFix==CEMENT);
                            var linerChoices = view.down('#linerArticleDropdown');						
                            if(isProstBaseDataChange || isTimeDataChange)
                                linerChoices.getStore().loadData(liners);						
                        }			
                    }
                    else{                                           
                        if(triggerCmp.itemId!='caputArticleDropdown'){
                            view.down('#caputArticleDropdown').getStore().loadData(capDefaults);
                            view.down('#caputArticleDropdown').setValue('Alla');
                            view.down('#caputArticleDropdown').setDisabled(true);
                        }                       
                        view.down('#availableRows').setHtml('Antal artiklar: <b>0</b>' );
                    }
                }
            });
        },
        updatePart: function (record, part, cmp) {		
            var newChoices = this.enumerateNewChoices(record, part);
            var addition = this.checkForAdditions(newChoices, part);
            var deletion = this.checkForDeletions(newChoices, part);
            this.oldChoices[part] = newChoices;
            if (addition || deletion) {
              if (!window.event.ctrlKey) {
                var newValue = addition || deletion;
                this.oldChoices[part] = [];
                this.oldChoices[part].push(newValue);
                var articleText='ArticleDropdown';
                if(part=='capSize')
                    articleText='Dropdown';                
                this.getView().down('#' + part + articleText).clearValue();
                this.getView().down('#' + part + articleText).setValue(newValue);
                this.getView().down('#' + part + articleText).collapse();
              }
            }
            this.update(cmp);
        },
        checkForAdditions: function (record, part) {
        for (var item in record) {
          if (!this.oldChoices[part].includes(record[item])) {
            return record[item];
          }
        }
        return '';
      },    
      checkForDeletions: function (record, part) {
        for (var item in this.oldChoices[part]) {
          if (!record.includes(this.oldChoices[part][item])) {
            return this.oldChoices[part][item];
          }
        }
        return '';
      },    
      enumerateNewChoices: function (record, part) {
        var newChoices = [];
        var indexName='article_'+ part;
        if(part=='capSize')
            indexName='CaputSize';	
        for (var item in record) {
          if (item === '') continue;
          newChoices.push(record[item].data[indexName]);
        }
        return newChoices;
      },
      // IE adds superfluous characters to dates
      stripControlCharacters: function (date) {
        return date.replace(/[^ -~]/g, '');
      },
        updateCaps: function () {
            var view = this.getView();
            view.down('#caputArticleDropdown').getStore().removeAll();        
            this.update();
        },
        updateStartDate: function () {
            var view = this.getView();
            var startDate = view.down('#startDate').getValue();
            var endDate = view.down('#endDate').getValue();
            if (startDate < new Date('1999-01-01')) view.down('#startDate').setValue(new Date('1999-01-01'));                   
            this.update(view.down('#startDate'));
        },   
       updateEndDate: function () {
            var view = this.getView();
            var startDate = view.down('#startDate').getValue();
            var endDate = view.down('#endDate').getValue();
            if (endDate > new Date()) view.down('#endDate').setValue(new Date());
            
            this.update(view.down('#endDate'));
        },	
        isDifferenceLessThanOneYear: function () {
            var view = this.getView();
            var startDate = view.down('#startDate').getValue();
            var endDate = view.down('#endDate').getValue();
            return startDate > Ext.Date.add(endDate, Ext.Date.YEAR, -1);
        },       
        exportTable: function (element) {       
            var tag = element.el.dom;
            if (!tag) return;
            var content = this.createContentToDownload(element.itemId.replace('exportTable', ''));
            var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            /*IE downloads directly, use the download attribute for others */
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(blob, 'registreringar.csv');
            } else {
                tag.setAttribute('href', url);
            }
        },
        createContentToDownload: function (language) {          
            if(!data3)
                return;		
            var content = '';       
            var view = this.getView();
            content+=selections;
            content += '\n';
            content += 'HIP PROTHESIS DATA';
            content += '\n';
            content +='Prothesis details'  + '\n';
            content +='Manufacturer;'+data1.Manufacturer + '\n';
            content +='UKDistributor;'+data1.UKDistributor + '\n';
            content +='Brand;'+data1.Brand + '\n';
            content +='DateOfOriginalSubmissionOfForm;'+data1.DateOfOriginalSubmissionOfForm + '\n';
            content +='DateOfChange;'+data1.DateOfChange + '\n';
            content +='Technical design features' + '\n';
            content +='Fixation;'+data1.Fixation + '\n';
            content +='Modularity;'+data1.Modularity + '\n';
            content +='DesignFeatures;'+data1.DesignFeatures + '\n';
            content +='CompatibleImplants;'+data1.CompatibleImplants + '\n';
            content +='Cup/Stem design history' + '\n';
            content +='DateOfFirstClinicalUse;'+data1.DateOfFirstClinicalUse + '\n';
            content +='DesignChange;'+data1.DesignChange + '\n';
            content +='LatestDesign;'+data1.LatestDesign + '\n';
            content +='Benchmark Claimed' + '\n';
            content +='BenchmarkClaimed;'+data1.BenchmarkClaimed + '\n';
            content +='BeyondComplianceProduct;'+data1.BeyondComplianceProduct + '\n';
            content +='RepresentativeResults;'+data1.RepresentativeResults + '\n';		
            content += '\n';
            content += 'HIP CLINICAL REFERENCE DATA SUMMARY'+ '\n';	
            content += '\n';						
            content +='REFERENCETYPE;' + '\n';
            data2.ReferenceType + '\n';
            content +='REFERENCE; These data were extracted from the Swedish Hip Arthroplasty Register' + '\n';
            content +='COHORT PROTHESIS DETAILS' + '\n';
            content +='ProductType;' + data2.ProductType + '\n';
            content +='STEMBrands;' + data2.STEMBrands + '\n';
            content +='HEADBrands;' + data2.HEADBrands + '\n';
            content +='CUPBrands;' + data2.CUPBrands + '\n';
            content +='LINERBrands;' + data2.LINERBrands + '\n';
            content +='CLINICAL STUDY DETAILS;' + '\n';
            content +='NumberOfCentres;' + data2.NumberOfCentres+ '\n';
            content +='NumberOfSurgeonsImplanting;' + data2.NumberOfSurgeonsImplanting + '\n';
            content +='StudyByProductDeveloper;' + data2.StudyByProductDeveloper + '\n';
            content +='COMMENTS;' + '\n';		
            content += data2.Comments + '\n';		
            content +='CLINICAL STUDY DESIGN;' + '\n';
            content +='ClinicalStudyDesign;' + data2.ClinicalStudyDesign  + '\n';
            content +='\n';
            content +='PATIENTS AND CLINICAL RESULTS;' + '\n';
            content +='TotalNumberOfPatients;' + data2.TotalNumberOfPatients + '\n';
            content +='Males;' + data2.Males + '\n';
            content +='Females;' + data2.Females + '\n';
            content +='MeanAge;' + data2.MeanAge + '\n';
            content +='DIAGNOSIS;' + '\n';
            content +='OA;' + data2.OA + '\n';
            content +='RA;' + data2.RA + '\n';
            content +='OtherDiagnosis;' + data2.OtherDiagnosis + '\n';
            content +='TotalNumberOfHips;' + data2.TotalNumberOfHips + '\n';
            content +='ImplantsLostDueToDeath;' + data2.ImplantsLostDueToDeath + '\n';
            content +='NumberOfImplantsLostToFollowUp;' + data2.NumberOfImplantsLostToFollowUp + '\n';
            content +='NumberOfImplantsRevised;' + data2.NumberOfImplantsRevised + '\n';
            content +='NumberOfImplantsSurvived;' + data2.NumberOfImplantsSurvived + '\n';
            content +='NumberOfPatientsExamined;' + data2.NumberOfPatientsExamined + '\n';
            content +='NumberOfPatientsQuestioned;' + data2.NumberOfPatientsQuestioned + '\n';
            content +='MeanFollowUp;' + data2.MeanFollowUp + '\n';
            content +='\n';
            content +='REASON FOR REVISION IN FULL COHORT;' + '\n';
            content +='Infection;' + data2.Infection + '\n';
            content +='Pain;' + data2.Pain + '\n';
            content +='RecurrentDislocation;' + data2.RecurrentDislocation + '\n';
            content +='Fracture;' + data2.Fracture + '\n';
            content +='MalpositionMalalignment;' + data2.MalpositionMalalignment + '\n';
            content +='AsepticLoosening;' + data2.AsepticLoosening + '\n';
            content +='Wear;' + data2.Wear + '\n';
            content +='OtherRevisionReason;' + data2.OtherRevisionReason + '\n';
            content +='\n';
            content +='KAPLAN-MEIER SUVIVORSHIP;' + '\n';
            content +='KMSurvTime;' + data2.KMSurvTime + '\n';
            content +='NumberOfHipsRemaining;' + data2.NumberOfHipsRemaining + '\n';
            content +='\n';
            content +='CUMULATIVE REVISION RATE (1 - SURVIVAL);' + '\n';
            content +='AnyComponentRevised;' + data2.AnyComponentRevised + '\n';
            content +='StemRevised;' + data2.StemRevised + '\n';
            content +='CupRevised;' + data2.CupRevised + '\n';	            	
            content += '\n';		
            content +='PRODUCT CODE LISTING;' + '\n';
            if(data3.length>0){							
                for(var attrib in data3[0]){
                    content+=attrib +';';					
                }
                content += '\n';			
            }			        		
            for (var i in data3){						
                for(var attrib in data3[i]){
                    content+=data3[i][attrib] + ';';					
                }
                content += '\n';			
            }			        
            /* Set BOM to let Excel know what the content is */
            content = '\ufeff' + content;
            return content;
        },
        getSelections: function () {
            var view = this.getView();
            var selections = {};        
            selections.Stem = view.down('#stemArticleDropdown').getDisplayValue();
            selections.Cup = view.down('#cupArticleDropdown').getDisplayValue();				       	
            selections.capSizes=view.down('#capSizeDropdown').getDisplayValue();															
            selections.Caput=view.down('#caputArticleDropdown').getDisplayValue();									
            selections.Liner=view.down('#linerArticleDropdown').getDisplayValue();		
            return selections;
        }
    
    });    
    Ext.define('shpr.view.Filter', {
        extend: 'Ext.form.field.ComboBox',
        xtype: 'rcfilter',
        alias: 'view.rcfilter',
        forceSelection: false,
        typeAhead: true,
        queryMode: 'local',
        minChars: 1,
        anyMatch: true,
        autoSelect: false,
        caseSensitive: false,
        checkChangeEvents: ['change', 'keyup'],
        constructor: function (config) {
            config.queryMode = 'local';
            config.listeners = {change: config.selectCallback };
            this.callParent(arguments);
        }
    });
    var generalWidth=160;
    var xStep=170;
    var x1=10;
    var x2=x1+xStep;
    var x3=x2+xStep ;
    var x4=x3+xStep-30;
    var x5=x4+xStep;
    var x6=x5+xStep;
    var x7=x6+xStep-70;
    var yStep=70;
    var y1=20;
    var y2=y1+yStep - 20;
    var y3=y2+yStep - 50;
    var y4=y3+yStep;
    var y5=y4+yStep + 7;
    var y6=y5+yStep-50;
    var y7=y6+yStep-40;
    var y8=y7+yStep;
    var y9=y8+yStep-30;
    var y10=y9+yStep-30;
    var labelAlignAdjust=-5;
    Ext.define('shpr.view.Main', {
        extend: 'Ext.container.Container',
        height:900,
        width:1500,
        controller: 'main',
        layout: {
            type: 'absolute'	   
        },
        itemId: 'mainView',
        items: [
            {
                x:600,
                y:1,
                xtype: 'panel',
                itemId: 'spinnerPanel',
                height: 100,
                width:100,
                hidden: true,
                border: false,
                html: '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'
            },
            {
               xtype: 'component',          
               html: 'Data inmatad efter senast publicerade årsrapport skall användas med stor försiktighet då den inte är komplett eller validerad',
               x: x1,
               y: y1
           },
            {
               xtype: 'component',          
               html: 'Operationsdatum (enbart primäroperationer inkluderas i analysen)',
               x: x1,
               y: y2
           },
         {
             x: x1,
             y: y3,
             xtype: 'datefield',
             labelAlign:'top',
             width: 130,
             itemId: 'startDate',
             value: Ext.Date.add(new Date(), Ext.Date.YEAR, -4),
             fieldLabel: 'Fr.o.m.',
             labelWidth: 200,
             format: 'Y-m-d',
             altFormats: 'ymd|Ymd',
             listeners: {
                 change: 'updateStartDate'
             }
         },
         {
             x: x2,
             y: y3,
             xtype: 'datefield',
             labelAlign:'top',
             width: 130,
             itemId: 'endDate',   
             value: Ext.Date.add(new Date(), Ext.Date.YEAR, -3),
             fieldLabel: 'T.o.m.',
             labelWidth: 35,
             labelStyle: 'padding: 7px 0 0 0;',
             format: 'Y-m-d',
             altFormats: 'ymd|Ymd',
             listeners: {
                 change: 'updateEndDate'
             }
         },	
          {
              x: x1,
              y: y4,
              width:120,
              xtype: 'rcfilter',
              fieldLabel: 'Protestyp',
              editable:false,
              labelAlign:'top',
              itemId: 'protesisDropdown', 
              cls: 'scw-select',
              valueField: 'protesisCode',
              displayField: 'protesisName',
              value: '',
              sortfield: 'protesisName',
              sortdirection: 'DESC',
              selectCallback: 'update',
              store: {
                  fields: ['protesisCode', 'protesisName'],
                  data: [
                    { protesisCode: '', protesisName: '' },
                    { protesisCode: '1', protesisName: 'Total' },
                    { protesisCode: '2', protesisName: 'Halv' }
                  ]
              }
          },
          {
              x: x2,
              y: y4,
              width:80,
              xtype: 'rcfilter',
              fieldLabel: 'Uppföljningstid',
              editable:false,
              labelAlign:'top',
              itemId: 'fuDropdown',
              cls: 'scw-select',
              valueField: 'fuVal',
              selectCallback: 'update',	
              displayField: 'fuYear',
              value: '3',
              sortfield: 'fuYear',
              sortdirection: 'DESC',			 
              store: {
                  fields: ['fuYear', 'fuVal'],
                  data: [                
                    { fuYear: '3 år', fuVal: '3' },
                    { fuYear: '5 år', fuVal: '5' },
                    { fuYear: '7 år', fuVal: '7' },
                    { fuYear: '10 år', fuVal: '10' },
                    { fuYear: '13 år', fuVal: '13' }
                  ]
              },
              listeners: {
                   change: 'update'
               }
          },
           {
               xtype: 'component',          
               html: 'Huvudkomponent',
               x: x1,
               y: y5
           },
          {
              x: x2,
              y: y6,
              boxLabel: 'Cup',
              xtype:'radiofield', 
              inputValue: 1,
              name: 's',          
              id: 'cupRadio',
              listeners: {
                   change: 'update'
               }
          },
          {
              x: x1,
              y: y6,
              boxLabel: 'Stam',
              checked:true,
              xtype:'radiofield',
              inputValue: 1,
              name: 's',         
              id: 'stemRadio',
              listeners: {
                   change: 'update'
               }
             
          },
          
          {
              x: x1,
              y: y7,
              width:135,
              xtype: 'rcfilter',
              fieldLabel: 'Fixation Stam',
              editable:false,  
              labelAlign:'top',
              itemId: 'fixationStemDropdown',
              cls: 'scw-select',
              valueField: 'fixationStemCode',
              displayField: 'fixationStemName',
              value: '',
              sortfield: 'fixationStemName',
              sortdirection: 'DESC',	    
             selectCallback: 'update',		  
              store: {
                  fields: ['fixationStemCode', 'fixationStemName'],
                  data: [
                    { fixationStemCode: 'Alla', fixationStemName: 'Alla' },
                    { fixationStemCode: '2', fixationStemName: 'Ocementerad' },
                    { fixationStemCode: '1', fixationStemName: 'Cementerad' }
                  ]
              }
          },	    
          {
              x: x2,
              y: y7,
              width:135,
              xtype: 'combo',
              fieldLabel: 'Fixation Cup',
              editable:false,
              labelAlign:'top',
              itemId: 'fixationCupDropdown',
              cls: 'scw-select',
              valueField: 'fixationCupCode',
              displayField: 'fixationCupName',
              value: '',
              sortfield: 'fixationCupName',            
              sortdirection: 'DESC',	      
              store: {
                  fields: ['fixationCupCode', 'fixationCupName'],
                  data: [
                    { fixationCupCode: 'Alla', fixationCupName: 'Alla' },
                    { fixationCupCode: '2', fixationCupName: 'Ocementerad' },
                    { fixationCupCode: '1', fixationCupName: 'Cementerad' }
                  ]
              },
              listeners: {
                   change: function (){										
                        setLinerValue(this.up().down('#linerArticleDropdown'), this.up().down('#fixationCupDropdown')); 
                        this.up().getController().update(this);
                    }			   
               }
          },         
          {
               xtype: 'component',          
               html: 'Endast komponenter med >50 höfter "at risk" vid slutet av analystiden visas som val i rullgardinerna nedan',
               x: x1,
               y: y8
           },
         {
               x: x1,
               y: y9,
               width:generalWidth,               
               xtype: 'tagfield',
               fieldLabel: 'Artikel Stam<div class="scw-info"><div data-qtip="' + helpText +'">i</div></div>',		   
               editable:false,
               disabled:true,
               labelAlign:'top',
               itemId: 'stemArticleDropdown',
               multiselect: true,
               queryMode: 'local',
               stacked: true,
               cls: 'scw-select scw-multiselect',
               value: 'Alla',
               valueField: 'article_stem',
               displayField: 'article_stem',	       
               store: {
                   fields: ['article_stem', 'P_FemStem'],
                   data: stemDefaults // test
               },                                         
               listeners: {                   
                   select: function(combo, record){					                        
                        var arr = window.event.ctrlKey ? removeAllaItem(record, combo.valueField) : record;
                        combo.reset();    
                        combo.setValue(arr);
                        Ext.defer(combo.update, 0);                        
                        this.up().getController().updatePart(record, 'stem', this);
                   }
               }
           },	  
         {
             x: x2,
             y: y9,
             width:generalWidth,
             xtype: 'tagfield',
             fieldLabel: 'Artikel Cup<div class="scw-info"><div data-qtip="' + helpText +'">i</div></div>',
             labelAlign:'top',
             itemId: 'cupArticleDropdown',
             editable:false,
             disabled:true,
             multiselect: true,
             queryMode: 'local',
             stacked: true,
             cls: 'scw-select scw-multiselect',
             value: 'Alla',
             valueField: 'article_cup',
             displayField: 'article_cup',	     
             store: {
                 fields: ['article_cup', 'P_AcetCup'],
                 data: cupDefaults
             },
             
             listeners: {
                 select: function(combo, record){					
                    var arr = window.event.ctrlKey ? removeAllaItem(record, combo.valueField) : record;
                    combo.reset();    
                    combo.setValue(arr);
                    Ext.defer(combo.update, 0);       
                    this.up().getController().updatePart(record, 'cup', this);
                   }
             }
         },
        {
            x: x3,
            y: y9,
            width:120,
            xtype: 'tagfield',
            fieldLabel: 'Caputstorlek<div class="scw-info"><div data-qtip="' + helpText +'">i</div></div>',
            labelAlign:'top',
            editable:false,
            disabled:true,
            itemId: 'capSizeDropdown',
            multiselect: true,
            queryMode: 'local',
            stacked: true,
            cls: 'scw-select scw-multiselect',
            value: 'Alla',
            valueField: 'CaputSize',
            displayField: 'P_FemCaput',        
            store: {
                fields: ['CaputSize', 'P_FemCaput'],
                data: capSdefaults
            },
            
             listeners: {
                 select: function(combo, record){					                        
                    var arr = window.event.ctrlKey ? removeAllaItem(record, combo.valueField) : record;
                    combo.reset();    
                    combo.setValue(arr);
                    Ext.defer(combo.update, 0);       
                    this.up().getController().updatePart(record, 'capSize', this);
                   }
             }
        },  
        { 
            x: x4,
            y: y9,
            width:generalWidth,
            xtype: 'tagfield',
            fieldLabel: 'Caput<div class="scw-info"><div data-qtip="' + helpText +'">i</div></div>',
            labelAlign:'top',
            itemId: 'caputArticleDropdown',
            editable:false,
            disabled:true,
            multiselect: true,
            queryMode: 'local',
            stacked: true,
            cls: 'scw-select scw-multiselect',
            value: 'Alla',
            valueField: 'ArticleCaput',
            displayField: 'ArticleCaput',               
            store: {
                fields: ['ArticleCaput ', 'FemCaput'],
                data: {
                    'ArticleCaput ': 'Alla',
                    'FemCaput': 'Alla'
                }
            },            
            listeners: {
                select: function(combo, record){					
                    var arr = window.event.ctrlKey ? removeAllaItem(record, combo.valueField) : record;
                    combo.reset();    
                    combo.setValue(arr);
                    Ext.defer(combo.update, 0);       
                    this.up().getController().updatePart(record, 'caput', this);
                   }
            }
        },  
         {
             x: x5,
             y: y9,
             width:generalWidth,
             xtype: 'tagfield',
             editable:false,
             disabled:true,
             fieldLabel: 'Artikel Liner<div class="scw-info"><div data-qtip="' + helpText +'">i</div></div>',
             labelAlign:'top',
             itemId: 'linerArticleDropdown',
             multiselect: true,
             queryMode: 'local',
             stacked: true,
             cls: 'scw-select scw-multiselect',
             value: 'Ingen',
             valueField: 'article_liner',
             displayField: 'article_liner',          
             store: {
                 fields: ['article_liner', ' P_AcetLiner'],
                 data: linerDefaults
             },             
             listeners: {
                 select: function(combo, record){					
                    var arr = window.event.ctrlKey ? removeAllaItem(record, combo.valueField) : record;
                    combo.reset();    
                    combo.setValue(arr);
                    Ext.defer(combo.update, 0);       
                    this.up().getController().updatePart(record, 'liner', this);
                   }
             }
         },       
         {
             x: x6,
             y: y9+30,
             xtype: 'button',
             itemId: 'exportTable',
             cls: 'scw-download-button',
             autoEl: {
                 tag: 'a',
                 download: 'registreringar.csv'
             },
             disabled:true,
             text: '&#xf019 Excel',
             listeners: {
                 click: 'exportTable'
             }
         },
         {
             x: x7,
             y: y9+30,
             border: false,
             width:200,
             xtype: 'panel',
             itemId: 'availableRows',                  		
             html: ''         
         }
        ]
    });    
    var main;
    Ext.application({
        name: 'shpr',
        units: [],
        viewcontrollers: [         
        ],
        launch: function () {
            var target = (typeof Stratum.containers !== 'undefined') ? Stratum.containers['KRH/ODEP'] : 'contentPanel';
            main = Ext.create('shpr.view.Main', {
                renderTo: target
            });
            if (!window.navigator.msSaveBlob) {
                main.down('#exportTable').setHref(' ');			
            }
            main.getController().update();
            main.getController().oldChoices = {};
            main.getController().oldChoices.stem = ['Alla'];
            main.getController().oldChoices.cup = ['Alla'];
            main.getController().oldChoices.caput = ['Alla'];
            main.getController().oldChoices.capSize = ['Alla'];
            main.getController().oldChoices.liner = ['Ingen', 'Alla'];
        }
    });
// ! SHPRs företagsmodul: odep
//# sourceURL=KRH/ODEP

        
    
    