module Events exposing (..)

import Knight.UV exposing (..)
import Knight.Types exposing (..)
import Knight exposing (Knight)

type Side
  = Left
  | Right

type Event
  = Attack (Side, String, Stage)
  | Infliction (Side, Status, Int)
  | Recovery (Side, Status)

defend : Float -> Float -> Float
defend defence damage =
  let
    log10 = logBase 10
  in
    if defence * 2 < damage then
      damage - defence
    else
      damage * (1 - (0.5 + 0.19 * log10((2 * defence - damage)/15 + 1)))
