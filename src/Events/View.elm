module Events.View exposing (log)

import Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import View.Shortcuts exposing (toText)
import Util exposing (find)

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

unknownAttack = (Basic, 0)

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
    getDamage knight weapon stage ->
      let
        equip = knight.weapons
          |> find (\eq -> eq.weapon == weapon)
          |> Maybe.withDefault unknownEquip
      in
        3
    eventLog event =
      case event of
        Attack (side, weaponName, stage)->
          let
            knight = getKnight side
            opponent = getOpponent side
            weapon = getWeapon weaponName
            damage = getDamage knight weapon stage
          in
            [ div [ class <| "event " ++ (toString side) ]
              [ div [ class "attack-flow header" ]
                [ div [ class "knight-name" ] [ text <| .name <| knight side ]
                , div [ class "weapon" ] [ text weaponName ]
                ]
              , div [ class "attack-flow" ]
                [ div [ class "attack-stage" ] [ toText stage ]
                , div [ class "attack-damage" ]
                  [ toText <| defence () ]
                ]
              ]
            ]
        _ -> []
  in
    div [ class "events" ] <| List.concatMap eventLog events
