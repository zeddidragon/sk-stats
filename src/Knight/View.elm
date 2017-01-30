module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar, toText)
import Knight.UvForm exposing (weaponUvForm, armourUvForm)

replace list index new =
  List.indexedMap (\i old -> if i == index then new else old) list

form message knight =
  let
    helmet = knight.helmet
    armour = knight.armour
    weapon = knight.weapon
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapon equip = message {knight | weapon = equip}
    equipHPiece piece = equipHelmet {helmet | armour = piece}
    equipAPiece piece = equipArmour {armour | armour = piece}
    equipWPiece piece = equipWeapon {weapon | weapon = piece}
    equipHUv index uv = equipHelmet {helmet | uvs = replace helmet.uvs index uv}
    equipAUv index uv = equipArmour {armour | uvs = replace armour.uvs index uv}
    equipWUv index uv = equipWeapon {weapon | uvs = replace weapon.uvs index uv}
  in
    div []
      [ h1 [] [ text knight.name ]
      , div [ class "slot" ]
        ( [ selectList equipHPiece armours knight.helmet.armour |> item "Helmet" ]
          ++ armourUvForm equipHUv knight.helmet.uvs
        )
      , div [ class "slot" ]
        ( [ selectList equipAPiece armours knight.armour.armour |> item "Armour" ]
          ++ armourUvForm equipAUv knight.armour.uvs
        )
      , div [ class "slot" ]
        ( [ selectList equipWPiece  swords knight.weapon.weapon |> item "Weapon" ]
          ++ weaponUvForm equipWUv knight.weapon.uvs
        )
      ]

stats knight =
  List.concat
    [ [ item "Health" (health knight) ]
    , defences knight
    , resistances knight
    ]
  |> div []

defences knight =
  let
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar (toString dtype) amount Knight.maxDefence
        , div [ class "value" ] [ toText amount ]
        ])
  in
    Knight.defences knight |> List.map defence

resistances knight =
  let
    pip = div [ class "pip" ] []
    pips status amount =
      let
        n = truncate amount
      in
        div [ class ("graphic " ++ (toString status)) ]
          [ div [ class "graphic negative" ] ( List.repeat -n pip )
          , div [ class "graphic positive" ] ( List.repeat n pip )
          ]
    resistance (status, amount) =
      item (toString status) (div [ class "graphic" ]
        [ pips status amount
        , div [ class "value" ] [ toText amount ]
        ])
  in
    List.map resistance (Knight.resistances knight)

health knight =
  div [ class "row" ]
    [ div [ class "hearts" ] [ String.repeat (Knight.hearts knight) "♥" |> text ]
    , div [ class "value" ] [ Knight.health knight |> toText ]
    ]


item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

