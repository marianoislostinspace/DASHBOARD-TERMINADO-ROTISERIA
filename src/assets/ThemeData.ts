import type { SweetAlertOptions } from "sweetalert2"

interface ThemeData {
    bgPrimary: string,
    bgSecondary: string,
    btnPrimary: string,
    btnDanger: string,
    textColor: string
}


export const darkTheme : ThemeData = {
    bgPrimary: "#4a4853",
    bgSecondary: "#1f1d27",
    btnPrimary:"#623075ff",
    btnDanger: "#b11010",
    textColor: "#f5f5f5"
} 

export const swalThemeConfig : SweetAlertOptions = {
      theme: "dark",
      background: darkTheme.bgPrimary,
      confirmButtonColor: darkTheme.btnPrimary,
      cancelButtonColor: darkTheme.btnDanger,
}
