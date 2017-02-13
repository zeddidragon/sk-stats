module Util exposing (..)

import Base64
import List
import String
import Tuple

atIndex : Int -> List a -> Maybe a
atIndex index list =
  list
    |> List.drop index
    |> List.head

index : a -> List a -> Maybe Int
index item list =
  list
    |> List.indexedMap (\i a -> (i, a))
    |> List.filter (\(i, a) -> item == a)
    |> List.map Tuple.first
    |> List.head

rIndex : a -> List a -> Maybe Int
rIndex item list =
  list
    |> List.indexedMap (\i a -> (i, a))
    |> List.filter (\(i, a) -> item == a)
    |> List.map Tuple.first
    |> List.reverse
    |> List.head

find : (a -> Bool) -> List a -> Maybe a
find search list =
  list
    |> List.filter search
    |> List.head

rFind : (a -> Bool) -> List a -> Maybe a
rFind search list =
  list
    |> List.reverse
    |> find search

replace : List a -> Int -> a -> List a
replace list index new =
  List.indexedMap (\i old -> if i == index then new else old) list

strReplace : String -> String -> String -> String
strReplace str old new =
  str
    |> String.split old
    |> String.join new

remove : Int -> List a -> List a
remove index list =
  (List.take index list) ++ (List.drop (index + 1) list)

pretty : Float -> String
pretty num =
  let
    full = num * 10 |> floor |> toString
  in
    String.dropRight 1 full ++ "." ++ String.right 1 full

query : String -> List (String, String)
query qstring =
  let
    toTuple item = 
      let
        first = List.head item |> Maybe.withDefault "herp"
        last = List.drop 1 item |> List.head |> Maybe.withDefault "derp"
      in
        (first, last)
  in
    qstring
      |> String.dropLeft 1
      |> String.split "&"
      |> List.map (String.split "=")
      |> List.map toTuple

queryValue : String -> String -> Maybe String
queryValue qstring key=
  let
    toValue tuple =
      case tuple of
        Just (k, v) -> Just v
        _ -> Nothing
  in
    query qstring
      |> find (\(k, v)-> k == key)
      |> toValue

querify : List (String, String) -> String
querify tuples =
  let
    toQuery (a, b) =
      a ++ "=" ++ b
  in
    tuples
      |> List.map toQuery
      |> String.join "&"

btoa : String -> String
btoa string =
  case Base64.encode string of
    Result.Ok ret -> strReplace ret "=" ""
    Result.Err err -> err

orMaybe : Maybe a -> Maybe a -> Maybe a
orMaybe maybe alternative =
  case maybe of
    Nothing -> alternative
    _ -> maybe

