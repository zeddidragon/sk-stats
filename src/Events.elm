module Events exposing (..)

import Knight.UV exposing (..)
import Knight.Types exposing (..)
import Knight exposing (Knight)

type Side
  = Left
  | Right

type Event
  = Attack (Side, DamageType, Float)
  | Infliction (Side, Status, Int)
  | Recovery (Side, Status)
