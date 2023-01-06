
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
  export function getProcessPliego(processData:any){
    return (processData?.tender?.id)?`https://www.contrataciones.gov.py/licitaciones/convocatoria/${(processData?.tender?.id)}.html#pliego`:'';
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