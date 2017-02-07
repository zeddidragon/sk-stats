module Util exposing (..)

atIndex : Int -> List a -> Maybe a
atIndex index list =
  list
    |> List.drop index
    |> List.head

lIndex : a -> List a -> Maybe Int
lIndex item list =
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

replace : List a -> Int -> a -> List a
replace list index new =
  List.indexedMap (\i old -> if i == index then new else old) list

remove : Int -> List a -> List a
remove index list =
  (List.take index list) ++ (List.drop (index + 1) list)
