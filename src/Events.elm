module Events exposing (..)

import String
import Tuple
import Knight exposing (Knight)
import Knight.Status exposing (..)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Util exposing (find)

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
  min 8 (infliction - resistance)

damage : Bool -> Side -> Knight -> Knight -> List (Side, Event) -> (Side, Event) -> Float
damage lockdown offenderSide left right history (side, event) =
  let
    defenderSide = if offenderSide == Left then Right else Left
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
    defence dType = Knight.defence lockdown defender dType
    aMod = attackModifier defenderSide left right history
    dMod = defenceModifier offenderSide left right history
    statusDamage =
      case event of
        Infliction (status, strength)->
          let
            resistance = Knight.resistance defender status
            severity = resist resistance <| statusStrength strength
          in
            case status of
              Fire -> toFloat <| Knight.Status.fireTotal severity
              Shock -> defend (dMod * defence Elemental) Knight.Status.shockDamage
              Sleep -> toFloat <| -1 * Knight.Status.sleepHeal severity
              _ -> 0
        _ -> 0

  in
    if side /= offenderSide then 0
    else
      case (attack, weapon) of
        (Just (stage, damage), Just wpn)->
          case wpn.piece.split of
            Just splitType ->
              defend (dMod * defence splitType) (aMod * damage / 2) +
              defend (dMod * defence wpn.piece.damageType) (aMod * damage / 2)
            Nothing ->
              defend (dMod * defence wpn.piece.damageType) (aMod * damage)
        _ -> statusDamage

totalDamage : Bool -> Side -> Knight -> Knight -> List (Side, Event) -> Float
totalDamage lockdown offenderSide left right history =
  let
    dmg = damage lockdown offenderSide left right
    recurse = totalDamage lockdown offenderSide left right
    defender = if offenderSide == Left then right else left
  in
    case history of
      [] -> 0
      x::xs -> dmg xs x + recurse xs
        |> Basics.max 0
        |> Basics.min (toFloat <| Knight.health defender)

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
      case find (isStatus status) history of
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
    findStatus status = find (\(s, severity) -> s == status) inflictions
    poison = 
      case findStatus Poison of
        Just (Poison, severity) ->
          (200 - Knight.Status.poisonFactor severity) / 200
        _ -> 1
    deathmark =
      case findStatus Deathmark of
        Just (Deathmark, severity) -> 0
        _ -> 1
  in
    1 * poison * deathmark

attackModifier : Side -> Knight -> Knight -> List (Side, Event) -> Float
attackModifier offenderSide left right history = 
  let
    inflictions = statuses offenderSide left right history
    findStatus status = find (\(s, severity) -> s == status) inflictions
    poison =
      case findStatus Poison of
        Just (Poison, severity) ->
          (100 - Knight.Status.poisonFactor severity) / 100
        _ -> 1
  in
    1 * poison
