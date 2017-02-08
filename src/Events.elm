module Events exposing (..)

import Knight exposing (Knight)
import Knight.UV exposing (..)
import Knight.Types exposing (..)
import Util exposing (find)

type Side
  = Left
  | Right

type Event
  = Attack (String, Stage)
  | Infliction (Status, Int)
  | Recovery (Status)

defend : Float -> Float -> Float
defend defence damage =
  let
    log10 = logBase 10
  in
    if defence * 2 < damage then
      damage - defence
    else
      damage * (1 - (0.5 + 0.19 * log10((2 * defence - damage)/15 + 1)))

damage : Bool -> Side -> Knight -> Knight -> List (Side, Event) -> (Side, Event) -> Float
damage lockdown offenderSide left right history (side, event) =
  let
    offender = if offenderSide == Left then left else right
    defender = if offenderSide == Left then right else left
    weapon =
      case event of
        Attack (weaponName, stage)->
          offender.weapons
            |> find (\eq -> eq.piece.name == weaponName)
        _ -> Nothing
    attack =
      case (event, weapon) of
        (Attack (weaponName, stage), Just wpn) ->
          wpn
            |> Knight.attacks offender
            |> List.map Tuple.first
            |> find (\attack -> Tuple.first attack == stage)
        _ -> Nothing
    defence dType = defender
      |> Knight.defences lockdown
      |> find (\def -> Tuple.first def == dType)
      |> Maybe.withDefault (dType, 0)
      |> Tuple.second
  in
    case (attack, weapon) of
      (Just (stage, damage), Just wpn)->
        case wpn.piece.split of
          Just splitType ->
            defend (defence splitType) (damage / 2) +
            defend (defence wpn.piece.damageType) (damage / 2)
          Nothing ->
            defend (defence wpn.piece.damageType) damage
      _ -> 0

totalDamage : Bool -> Side -> Knight -> Knight -> List (Side, Event) -> Float
totalDamage lockdown offenderSide left right history =
  let
    dmg = damage lockdown offenderSide left right
    recurse = totalDamage lockdown offenderSide left right
  in
    case history of
      [] -> 0
      x::xs -> dmg xs x + recurse xs

