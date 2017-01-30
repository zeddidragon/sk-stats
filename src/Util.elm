module Util exposing (..)

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
