module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar, toText)
import Knight.UvForm exposing (weaponUvForm, armourUvForm)

form message knight =
  let
    helmet = knight.helmet
    armour = knight.armour
    weapon = knight.weapon
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapon equip = message {knight | weapon = equip}
    equipHPiece piece = equipHelmet {helmet | piece = piece}
    equipAPiece piece = equipArmour {armour | piece = piece}
    equipWPiece piece = equipWeapon {weapon | piece = piece}
    equipHUv uvs = equipHelmet {helmet | uvs = uvs}
    equipAUv uvs = equipArmour {armour | uvs = uvs}
    equipWUv uvs = equipWeapon {weapon | uvs = uvs}
  in
    div []
      [ h1 [] [ text knight.name ]
      , div [ class "slot" ]
        ( [ selectList equipHPiece armours knight.helmet.piece |> item "Helmet" ]
          ++ armourUvForm equipHUv knight.helmet
        )
      , div [ class "slot" ]
        ( [ selectList equipAPiece armours knight.armour.piece |> item "Armour" ]
          ++ armourUvForm equipAUv knight.armour
        )
      , div [ class "slot" ]
        ( [ selectList equipWPiece  swords knight.weapon.piece |> item "Weapon" ]
          ++ weaponUvForm equipWUv knight.weapon
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

