port module LocalStorage exposing (lsSave, lsData)

port lsSave : List (String, String) -> Cmd msg
port lsData : (List (String, String) -> msg) -> Sub msg
