module Util exposing (..)

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

remove : Int -> List a -> List a
remove index list =
  (List.take index list) ++ (List.drop (index + 1) list)

pretty : Float -> String
pretty num =
  let
    full = num * 10 |> floor |> toString
  in
    String.dropRight 1 full ++ "." ++ String.right 1 full
