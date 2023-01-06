
import { format }  from 'date-fns';

export function getString(CADENA:any){
    if(CADENA!==null&&CADENA!==undefined){
        return CADENA.toString();
    }else{
        return '';
    }
}
export function getDateFormat(text:string){
    if(text){
      return format(new Date(text), "dd/MM/yyyy");
    }else{
      return '';
    }
    
  }
export function pagination(ACTUAL:number, ULTIMA:number) {
    var paginas=[];
    var paginasPuntos=[];
    var espaciado=2;
    var izquierda=ACTUAL - espaciado;
    var derecha=ACTUAL + espaciado;
    var contador=0;
    for(let i=1;i<=ULTIMA;i++){
        if (i==1||i==ULTIMA||(i>=izquierda&&i<=derecha)){
            paginas.push(i);
        }
    }
    for(let i=0;i<paginas.length;i++){
        if(contador){
            if ((paginas[i]-contador)!=1) {
                paginasPuntos.push('...');
            }
        }
        paginasPuntos.push(paginas[i]);
        contador=paginas[i];
    }
    return paginasPuntos;
}
export function getNumber(STRING:any){
    STRING=getString(STRING);
    if(Number(STRING)){
        return Number(STRING);
    }else{
        return 0;
    }
}
export function validateString(STRING:any){
    STRING=getString(STRING);
    if(!(STRING==='')){
        return true
    }else{
        return false;
    }
}

export function validate(CADENA:any){
    if(CADENA!==null&&CADENA!==undefined){
        return true;
    }else{
        return false;
    }
}

export function likeText(text:string,term:string){
    let termSearch=term.trim().toLowerCase();
    let textSearch=text.toLowerCase();
    let arrayTerms=termSearch.split(' ');
    for(let i=0;i<arrayTerms.length;i++){
        if(arrayTerms[i].trim()){
            let REGULAR=new RegExp(arrayTerms[i].trim(), "g");
            return REGULAR.test(textSearch);
        }
    }
  return false;
}

export function minText(text:string,max:number){
    text=getString(text);
    if(text.length>max){
       return text.substring(0, max)+'...';
    }else{
        return text;
    }
  }
