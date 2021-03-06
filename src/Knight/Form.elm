module Knight.Form exposing (form)

import Knight exposing (Knight)
import Knight.Bombs
import Knight.Shield exposing (shields)
import Knight.Armour exposing (armours)
import Knight.UV.Form exposing (weaponForm, armourForm, trinketForms)
import Knight.Encode exposing (encode, decode)
import Html exposing (Html, div, text, input)
import Html.Attributes exposing (class, type_, value)
import Html.Events exposing (onClick, onInput)
import Util exposing (replace, remove)
import View.Shortcuts exposing (selectList, item, divisor, button)

form : List (String, String) -> ((String, String) -> b) -> (Knight -> b) -> Knight -> Html b
form loadouts save equip knight =
  let
    rename name = equip {knight | name = name}
    equipShield slot = equip {knight | shield = slot}
    equipHelmet slot = equip {knight | helmet = slot}
    equipArmour slot = equip {knight | armour = slot}
    equipWeapons slot = equip {knight | weapons = slot}
    equipTrinkets slot = equip {knight | trinkets = slot}
    equipVita slot = equip {knight | vita = slot}
    equipLoadout (name, data) =
      let
        rename knight =
          {knight | name = name}
        loaded =
          data
            |> decode
            |> Maybe.map rename
            |> Maybe.withDefault knight
      in
        equip loaded
    slot message equipment items title uvForm =
      let
        equipPiece piece = message <| {equipment | piece = piece}
        equipUv uvs = message <| {equipment | uvs = uvs}
      in
        div [ class "slot" ]
          ( [ selectList .name equipPiece items equipment.piece |> item title ]
            ++ uvForm equipUv equipment
          )
    weaponSlots message knight =
      let
        equipWeapon index weapon =
          message <| replace knight.weapons index weapon
        addWeapon =
          message <| knight.weapons ++
            [ { piece = Knight.Bombs.nitro
              , uvs = []
              }
            ]
        removeWeapon index =
          message <| remove index knight.weapons
        weaponSlot index weapon =
          div [class "weapon slot"] (
            slot
              (equipWeapon index)
              weapon
              Knight.weapons
              ("Weapon " ++ toString (index + 1))
              weaponForm
            :: (
              if index > 1 then
                [ button [ onClick <| removeWeapon index ] [ text "-" ] ]
              else
                []
            )
          )
      in
        List.indexedMap weaponSlot knight.weapons
        ++ (
          if List.length knight.weapons < 4 then
            [ button [ onClick addWeapon ] [ text "+ Weapon" ] ]
          else
            []
        )
    padNum num =
      num
        |> toString
        |> String.padLeft 2 ' '
  in
    div [ class "knight-form" ]
      (
      [ input
        [ type_ "text"
        , value knight.name
        , onInput rename
        ] []
      , div
        [ class "button"
        , onClick <| save (knight.name, encode knight)
        ] [ text "Save Loadout" ]
      , item "Loadout" <| selectList
        Tuple.first
        equipLoadout
        loadouts
        (knight.name, encode knight)
      , divisor
      , slot equipShield knight.shield shields "Shield" armourForm
      , divisor
      , slot equipHelmet knight.helmet armours "Helmet" armourForm
      , slot equipArmour knight.armour armours "Armour" armourForm
      , divisor
      ]
      ++ weaponSlots equipWeapons knight
      ++ (divisor :: trinketForms equipTrinkets knight.trinkets)
      ++ ([ divisor
          , selectList padNum equipVita (List.range 0  21) knight.vita
            |> item "Vita"
         ])
      )

