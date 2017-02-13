port module LocalStorage exposing (lsSave, lsData)

port lsSave : (String, String) -> Cmd msg
port lsData : (List (String, String) -> msg) -> Sub msg
