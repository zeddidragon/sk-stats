module Events exposing (..)

import Knight exposing (Knight)
import Knight.UV exposing (..)
import Knight.Types exposing (..)
import Util exposing (find, rFind)

type Side
  = Left
  | Right

type Event
  = Attack (String, Stage)
  | Infliction (Status, StatusStrength)
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

resist : Float -> Float -> Float
resist resistance infliction =
  if infliction > 3 then
    clamp -6 8 (infliction - resistance)
  else
    min 8 (infliction - resistance)

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

statuses : Side -> Knight -> Knight -> List (Side, Event) -> List (Status, Float)
statuses offenderSide left right history =
  let
    statuses = [Fire, Freeze, Poison, Shock, Stun, Curse, Deathmark]
    isStatus status (side, event) =
      case event of 
        Infliction (s, strength) ->
          side == offenderSide && s == status
        Recovery (s) ->
          side /= offenderSide && s == status
        _ -> False
    knight = if offenderSide == Left then right else left
    toInfliction status =
      case rFind (isStatus status) history of
        Just (side, (Infliction (s, strength))) ->
          let
            str = statusStrength strength
            res = Knight.resistance knight status
            value = resist res str
          in
            if value < -6 then
              Nothing
            else
              Just (s, value)
        _ -> Nothing
  in
    List.filterMap toInfliction statuses

defenceModifier : Side -> Knight -> Knight -> List (Side, Event) -> Float
defenceModifier offenderSide left right history =
  let
    inflictions = statuses offenderSide left right history
  in
    1
