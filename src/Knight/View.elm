module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList)
import List exposing (map)

form knight =
  div []
    [ item knight.name (div[][])
    , item "Helmet" (selectList armours knight.helmet.armour)
    , item "Armour" (selectList armours knight.armour.armour)
    , item "Weapon" (selectList swords knight.weapon.weapon)
    ]

stats knight =
  div [] (
    [ item "Health" (health knight)
    ] ++ (defences knight)
  )

defences knight =
  let
    defence (dtype, amount) =
      item (toString dtype) (text (toString amount))
  in
    List.map defence (Knight.defences knight)

health knight =
  div [ style [ ("display", "flex") ] ]
    [ div [ style [ ("color", "red") ] ]
      [ text (String.repeat (Knight.hearts knight) "♥") ]
    , div
      [ style
        [ ("flex", "1")
        , ("padding-left", "1em")
        ]
      ]
      [ text (toString (Knight.health knight)) ]
    ]


item label content =
  div
    [ style
      [ ("padding", "0.5em")
      , ("display", "flex")
      ]
    ]
    [ Html.label
      [ style
        [ ("flex", "1")
        , ("font-weight", "bold")
        , ("font-size", "0.8em")
        , ("padding-right", "1em")
        ]
      ]
      [text label]
    , content
    ]

