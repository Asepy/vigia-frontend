
export function getProcessPlanningId(processData:any){

  if(processData?.planning?.identifier){
    return processData?.planning?.identifier
  }else if(processData?.ocid){

    if(/^(ocds-03ad3f-)\d+$/g.test(processData?.ocid)){
      return (processData.ocid.split('-')[processData.ocid.split('-').length-1])
    }

    if(/^(ocds-03ad3f-)\d+-\d+$/g.test(processData?.ocid)){
      return (processData.ocid.split('-')[processData.ocid.split('-').length-2])
    }
  }
  return null;
}
export function getProcessTitle(processData:any){
    return  (processData?.tender?.title)?(processData?.tender?.title):((processData?.planning?.budget?.description)?(processData?.planning?.budget?.description):null);
  }

  export function getProcurementMethodDetails(processData:any){
    return (processData?.tender?.procurementMethodDetails)?(processData?.tender?.procurementMethodDetails):null
  }
  export function getMainProcurementCategoryDetails(processData:any){
    return (processData?.tender?.mainProcurementCategoryDetails)?(processData?.tender?.mainProcurementCategoryDetails):null
  }

  export function getBuyer(processData:any){
    return  (processData?.buyer?.name)?(processData?.buyer?.name):(null);
  }

  export function getProcuringEntity(processData:any){
    return  (processData?.tender?.procuringEntity?.name)?(processData?.tender?.procuringEntity?.name):(null);
  }



  export function getProcuringEntityContactEmail(processData:any){
    let party= processData?.parties?.filter(
      (party:any)=>{
        return party?.id===(processData?.tender?.procuringEntity?.id);
      }
    )[0];
    return  (party?.contactPoint?.email)?(party?.contactPoint?.email):(null);
  }

  export function getProcuringEntityContactName(processData:any){
    let party= processData?.parties?.filter(
      (party:any)=>{
        return party?.id===(processData?.tender?.procuringEntity?.id);
      }
    )[0];
    return  (party?.contactPoint?.name)?(party?.contactPoint?.name):(null);
  }

  export function getProcuringEntityContactTelephone(processData:any){
    let party= processData?.parties?.filter(
      (party:any)=>{
        return party?.id===(processData?.tender?.procuringEntity?.id);
      }
    )[0];
    return  (party?.contactPoint?.telephone)?(party?.contactPoint?.telephone):(null);
  }



export function getProcuringEntityType(processData:any){
  let party= processData?.parties?.filter(
    (party:any)=>{
      return party?.id===(processData?.tender?.procuringEntity?.id);
    }
  )[0];
  return  (party?.details?.entityType)?(party?.details?.entityType):(null);
}

export function getProcuringEntityId(processData:any){
  let party= processData?.parties?.filter(
    (party:any)=>{
      return party?.id===(processData?.tender?.procuringEntity?.id);
    }
  )[0];
  return  (party?.id)?(party?.id):(null);
}



  export function getEnquiryPeriodEndDate(processData:any){
    return  (processData.tender?.enquiryPeriod?.endDate)?(processData.tender?.enquiryPeriod?.endDate):(null);
  }
  export function getTenderPeriodEndDate(processData:any){
    return  (processData.tender?.tenderPeriod?.endDate)?(processData.tender?.tenderPeriod?.endDate):(null);
  }
  export function getProcessAmount(processData:any){
    return  (processData?.tender?.value?.amount)?getCurrencyAmount(processData?.tender?.value?.amount):((processData?.planning?.budget?.amount?.amount)?getCurrencyAmount(processData?.planning?.budget?.amount?.amount):null);
  }
  export function getProcessCurrency(processData:any){
    return  (processData?.tender?.value?.currency)?processData?.tender?.value?.currency:(processData?.planning?.budget?.amount?.currency?processData?.planning?.budget?.amount?.currency:null);
  }

  export function getProcessItems(processData:any){
    return (processData?.tender?.items)?(processData?.tender?.items):((processData?.planning?.items)?(processData?.planning?.items):[]);
  }
  
  export function getProcessPliegoSlug(DNCPData:any){
    return (DNCPData)?`${getProcessURLSlug(DNCPData)}#pliego`:'';
  }
  export function getProcessSubmissionMethodDetails(processData:any){
    return (processData?.tender?.submissionMethodDetails)?processData?.tender?.submissionMethodDetails:'';
  }
  
  export function getProcessURLSlug(DNCPData:any){

    if(!DNCPData){
      return '';
    }
    return `https://www.contrataciones.gov.py/${getURLPrePath(DNCPData)}${getURLPostPath(DNCPData)}/${getURLSlugPath(DNCPData)}.html`;
  }



  /**
 * Obtiene el prefijo de la url de la informacion de un llamado
 * @param {*} processData JSON de un llamado del CSV del listado de Busqueda de licitaciones de la DNCP
 * @returns {string}
 */
function getURLPrePath(processData:any){
  switch(processData.tipo_licitacion){
      case 'tradicional':
          return 'licitaciones';
      case 'convenio':
          return 'convenios-marco';
      case 'precalificacion':
          return 'licitaciones';
      case 'licitacion_sin_difusion':
          return 'sin-difusion-convocatoria';
      default:
          return 'licitaciones';
  }
}

export function getString(string:any){
  if(string!==null&&string!==undefined){
      return string.toString();
  }else{
      return '';
  }
}
export function validateString(string:any){
  string=getString(string);
  if(!(string==='')){
      return true
  }else{
      return false;
  }
}
/**
* Obtiene el sufijo de la url de la informacion de un llamado
* @param {*} processData JSON de un llamado del CSV del listado de Busqueda de licitaciones de la DNCP
* @returns {string}
*/
function getURLPostPath(processData:any){
  switch(processData.tipo_licitacion){
      case 'tradicional':
          return  processData?.convocatoria_slug?'/convocatoria':(processData?.planificacion_slug?'/planificacion':'/adjudicacion');
      case 'convenio':
          return '/convocatoria';
      case 'precalificacion':
          return '/precalificacion'
      case 'licitacion_sin_difusion':
          return (['CE - CVE con difusión previa'].includes(processData?.tipo_procedimiento)&&validateString(processData.adjudicacion_slug)?'/excepcion_adj':'');
      default:
          return '/convocatoria';
  }
}


/**
* Obtiene el primer slug de un llamado para consultar su informacion
* @param {*} processData JSON de un llamado del CSV del listado de Busqueda de licitaciones de la DNCP
* @returns {string}
*/
function getURLSlugPath(processData:any){
  return getSlug(processData).split(',')[0];
}



/**
* Obtiene el slug de un llamado para consultar su informacion
* @param {*} processData JSON de un llamado del CSV del listado de Busqueda de licitaciones de la DNCP
* @returns {string}
*/
function getSlug(processData:any){
  switch(processData.tipo_licitacion){
      case 'tradicional':
          return processData.convocatoria_slug?processData.convocatoria_slug:(processData.planificacion_slug?processData.planificacion_slug:processData.adjudicacion_slug);
      case 'convenio':
          return processData.convocatoria_slug;
      case 'precalificacion':
          return processData.precalificacion_slug;
      case 'licitacion_sin_difusion':
          return processData.adjudicacion_slug?processData.adjudicacion_slug:processData.planificacion_slug;
      default:
          return processData.convocatoria_slug;
  }
}



  export function getCurrencyAmount(digit:number){
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG',minimumFractionDigits: 2,
    maximumFractionDigits: 2, currencyDisplay: 'code'}).format(digit).replace('PYG','').trim();
  }
  export function getProcessFaceEnquiry(processData:any){
    if(getEnquiryPeriodEndDate(processData)){
      let endDate=new Date(getEnquiryPeriodEndDate(processData));
      let today=new Date();
      let daysDifference = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if(daysDifference<=0){
        //roja
        return {
          img:"triste.svg",
          text:"Se te paso el tiempo para consultar"
        }
      }else if(daysDifference <= 2 ){
        return {
          img:"quiza.svg",
          text:"El tiempo es corto para consultar"
        }
      }else if(daysDifference <= 5){
        return {
          img:"masomenos.svg",
          text:"Aprovecha a consultar"
        }
      }else if(daysDifference > 5){
        return {
          img:"feliz.svg",
          text:"Estas a tiempo de consultar"
        }
      }else{
        return {
          img:"feliz.svg",
          text:"Estas a tiempo de consultar"
        }
      }

      
    }else{
      return {
        img:"",
        text:""
      }
    }
  }

  export function getProcessFaceClaim(processData:any){
    if(getTenderPeriodEndDate(processData)){
      let endDate=new Date(getTenderPeriodEndDate(processData));
      let today=new Date();
      let daysDifference = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if(daysDifference<=0){
        //roja
        return {
          img:"triste.svg",
          text:"Se te paso el tiempo para reclamar"
        }
      }else if(daysDifference <= 2 ){
        return {
          img:"quiza.svg",
          text:"El tiempo es corto para reclamar"
        }
      }else if(daysDifference <= 5){
        return {
          img:"masomenos.svg",
          text:"Aprovecha a reclamar"
        }
      }else if(daysDifference > 5){
        return {
          img:"feliz.svg",
          text:"Estas a tiempo de reclamar"
        }
      }else{
        return {
          img:"feliz.svg",
          text:"Estas a tiempo de reclamar"
        }
      }

      
    }else{
      return {
        img:"",
        text:""
      }
    }
  }

  export function checkProcessClaim(processData:any){
    if(getTenderPeriodEndDate(processData)){
      let endDate=new Date(getTenderPeriodEndDate(processData));
      let today=new Date();
      let daysDifference = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if(daysDifference<=0){
        //roja
        return false;
      }else{
        return true
      }

      
    }else{
      return false;
    }
  }

  export function checkProcessEnquiry(processData:any){
    if(getEnquiryPeriodEndDate(processData)){
      let endDate=new Date(getEnquiryPeriodEndDate(processData));
      let today=new Date();
      let daysDifference = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if(daysDifference<=0){
        //roja
        return false
      
      }else{
        return true
      }

      
    }else{
      return false
    }
  }
  export function getStage(obj: any) {
    switch (obj?.etapa) {
      case "tender":
        return "Llamado";
      case "planning":
        return "Planificación";
      case "contract":
        return "contrato";
      case "award":
        return "Adjudicación";
      default:
        return "Llamado";
    }
  }