module Events.View exposing (log)

import Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.UV exposing (..)
import Knight.Types exposing (..)
import View.Shortcuts exposing (toText)
import Util exposing (find)

unknownWeapon : Weapon
unknownWeapon =
  { name = "Unknown Weapon"
  , weaponType = Sword
  , damageType = Normal
  , chargeTime = 0
  , split = Nothing
  , status = Nothing
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

unknownAttack : (Stage, Float)
unknownAttack = (Basic, 0)

unknownEquip : WeaponEquip
unknownEquip =
  { piece = unknownWeapon
  , uvs = []
  }

log message events left right =
  let
    getKnight side = if side == Left then left else right
    getOpponent side = if side == Left then right else left
    getWeapon name =
      weapons
        |> find (\w -> w.name == name)
        |> Maybe.withDefault unknownWeapon
    getDamage side weapon stage =
      let
        knight = getKnight side
        opponent = getOpponent side
        equip = knight.weapons
          |> find (\eq -> eq.piece == weapon)
          |> Maybe.withDefault unknownEquip
        attack = equip
          |> Knight.attacks knight
          |> find (\(attack, infliction) -> (Tuple.first attack) == stage)
          |> Maybe.withDefault (unknownAttack, Nothing)
          |> Tuple.first
        damage = Tuple.second attack
        defence dType = opponent
          |> Knight.defences True
          |> find (\def -> Tuple.first def == dType)
          |> Maybe.withDefault (dType, 0)
          |> Tuple.second
      in
        case weapon.split of
          Just splitType ->
            defend (defence weapon.damageType) (damage / 2)
            + defend (defence splitType) (damage / 2)
          Nothing -> defend (defence weapon.damageType) damage
    eventLog events output =
      case events of
        [] -> output
        e :: es -> eventLog es output ++ eventEntry es e
    eventEntry history event =
      case event of
        Attack (side, weaponName, stage)->
          let
            knight = getKnight side
            opponent = getOpponent side
            weapon = getWeapon weaponName
            damage = getDamage side weapon stage
          in
            [ div [ class <| "event " ++ (toString side) ]
              [ div [ class "attack-flow header" ]
                [ div [ class "knight-name" ] [ text <| .name <| knight ]
                , div [ class "weapon" ] [ text weaponName ]
                ]
              , div [ class "attack-flow" ]
                [ div [ class "attack-stage" ] [ toText stage ]
                , div [ class "attack-damage" ]
                  [ toText <| ceiling <| damage ]
                ]
              ]
            ]
        _ -> []
  in
    div [ class "events" ] <| eventLog events []
